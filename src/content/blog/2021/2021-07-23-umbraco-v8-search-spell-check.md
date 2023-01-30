---
# # layout: post
title:  Adding spell check to Examine search in Umbraco 8
excerpt: ""
pubDate: 2021-07-23
---

<p class="lead">There is an <a href="https://blog.aabech.no/archive/building-a-spell-checker-for-search-in-umbraco/" target="_blank" rel="noopener nofollow">excellent blog post by Lars-Erik Aabech</a> on how to build a spell checker for search in Umbraco 7, and I have been looking for a way to update it for v8.</p>

## Background
The fundamental concepts of Lars' version are exactly what we want to do with this version: index all the text content of pages, and then search for words in the index if there are no results returned.

## Code
Firstly we need to create a new index! We're giving it the name `SpellCheckIndex` and defining one single field, `word`, which will hold all the text content from each of our pages.
```csharp
public class SpellCheckIndexCreator : LuceneIndexCreator
{
    public override IEnumerable<IIndex> Create()
    {
        LuceneIndex index = new LuceneIndex("SpellCheckIndex",
            CreateFileSystemLuceneDirectory("SpellCheckIndex"),
            new FieldDefinitionCollection(
                new FieldDefinition("word", FieldDefinitionTypes.FullText)
            ),
            new StandardAnalyzer(Version.LUCENE_30)
        );

        return new[] { index };
    }
}
```

```csharp
public class SpellCheckIndexPopulator : IndexPopulator
{
    private readonly SpellCheckValueSetBuilder _spellCheckValueSetBuilder;
    private readonly IContentService _contentService;

    public SpellCheckIndexPopulator(SpellCheckValueSetBuilder spellCheckValueSetBuilder, IContentService contentService)
    {
        _spellCheckValueSetBuilder = spellCheckValueSetBuilder;
        _contentService = contentService;
        RegisterIndex("SpellCheckIndex");
    }

    protected override void PopulateIndexes(IReadOnlyList<IIndex> indexes)
    {
        IContent[] content;
        long totalRecords = 0;
        int rootNode = -1;
        int pageIndex = 0;
        int pageSize = 10000;

        do
        {
            content = _contentService.GetPagedDescendants(rootNode, pageIndex, pageSize, out totalRecords).ToArray();

            if (content.Length > 0)
            {
                var valueSets = _spellCheckValueSetBuilder.GetValueSets(content);

                foreach (var index in indexes)
                {
                    index.IndexItems(valueSets);
                }
            }

            pageIndex++;
        }
        while (content.Length == pageSize);
    }
}
```

```csharp
public class SpellCheckValueSetBuilder : IValueSetBuilder<IContent>
{
    private readonly string[] FIELDS = new string[] { "nodeName", "title", "content", "metaDescription", "gridContent" };

    public IEnumerable<ValueSet> GetValueSets(params IContent[] content)
    {
        foreach (var c in content)
        {
            List<string> cleanValues = new List<string>();

            var properties = c.Properties.Where(x => FIELDS.Contains(x.Alias));
            CollectCleanValues(properties, cleanValues);

            var allWords = string.Join(" ", cleanValues);

            var indexValues = new Dictionary<string, object>()
            {
                ["word"] = allWords
            };

            var valueSet = new ValueSet(c.Id.ToString(), "word", indexValues);

            yield return valueSet;
        }
    }

    private void CollectCleanValues(IEnumerable<Property> properties, List<string> cleanValues)
    {
        foreach (var property in properties)
        {
            if (property.PropertyType.PropertyEditorAlias == Constants.PropertyEditors.Aliases.TextBox || property.PropertyType.PropertyEditorAlias == Constants.PropertyEditors.Aliases.TextArea)
            {
                var values = property.Values.WhereNotNull();
                foreach (var value in values)
                {
                    if (value.PublishedValue != null)
                    {
                        cleanValues.Add(CleanValue(value));
                    }
                }
            }

            if (property.PropertyType.PropertyEditorAlias == Constants.PropertyEditors.Aliases.Grid)
            {
                var values = property.Values.WhereNotNull();
                foreach (var value in values)
                {
                    if (value.PublishedValue != null)
                    {
                        string json = value.PublishedValue.ToString();
                        GridDataModel gridContent = GridDataModel.Deserialize(json);
                        cleanValues.Add(CleanValue(gridContent.GetSearchableText()));
                    }
                }
            }
        }
    }

    private static string CleanValue(PropertyValue value)
    {
        // Strip anything that's HTML
        string result = HttpUtility.HtmlDecode(value.PublishedValue.ToString().StripHtml());

        // Replace newlines
        result = result.Replace("\r", " ").Replace("\n", " ");

        // Replace punctuation (except single quotes in the middle of word, e.g. we're, don't)
        result = Regex.Replace(result, @"[^\w' ]+|'(?!\w)|(?<!\w)'", " ");

        // Lowercase all results
        result = result.ToLowerInvariant();

        return result;
    }

    private static string CleanValue(string value)
    {
        string result = value;

        // Replace newlines
        result = result.Replace("\r", " ").Replace("\n", " ");

        // Replace punctuation (except single quotes in the middle of word, e.g. we're, don't)
        result = Regex.Replace(result, @"[^\w' ]+|'(?!\w)|(?<!\w)'", " ");

        // Lowercase all results
        result = result.ToLowerInvariant();

        return result;
    }
}
```

And finally, yes, I'm working on getting this up and running for v9 too 😁