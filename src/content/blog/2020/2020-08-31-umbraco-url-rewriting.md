---
# layout: post
title:  URL rewriting in Umbraco 8
excerpt: I recently migrated a website from WordPress to Umbraco and was keen to keep some of the great SEO work driving traffic into the site.
pubDate: 2020-08-31
---

<p class="lead">I recently migrated a website from WordPress to Umbraco and was keen to keep some of the great SEO work driving traffic into the site.</p>

## Table of Contents
{:.no_toc}
1. The generated Toc will be an ordered list
{:toc}

## My first (not-quite-right) attempt...

The main thing for me was to keep the blog URLs as there were nearly 300 posts that had built up over 6 or 7 years, all following the structure `/blog/YEAR/MONTH/post-name`. At first, I opted to use a combination of built in property  `umbracoUrlAlias` along with the `ContentSaving` event, so that a slug would be auto generated based on the date the blog was published.

```csharp
public class PublishEventComponent : IComponent 
{
    public void Initialize()
    {
        ContentService.Published += ContentService_Published;
    }

    private void ContentService_Published(IContentService sender, ContentPublishedEventArgs e)
    {
        foreach (IContent node in e.PublishedEntities)
        {
            // Set blog post `umbracoUrlAlias`
            if (node.ContentType.Alias == "blogPost")
            {
                if (node.HasProperty("umbracoUrlAlias"))
                {
                    if (string.IsNullOrEmpty(node.GetValue<string>("umbracoUrlAlias")))
                    {
                        UmbracoHelper helper = Umbraco.Web.Composing.Current.UmbracoHelper;
                        List<string> urlList = new List<string>();
                        urlList.Add("blog");

                        if (node.HasProperty("publishedDate"))
                        {
                            DateTime publishedDate = node.GetValue<DateTime>("publishedDate");

                            urlList.Add(publishedDate.Year.ToString());
                            urlList.Add(publishedDate.Month.ToString("00"));

                            if (!string.IsNullOrEmpty(node.GetValue<string>("umbracoUrlName")))
                            {
                                urlList.Add(node.GetValue<string>("umbracoUrlName"));
                            }

                            else
                            {
                                IPublishedContent publishedContent = helper.Content(node.Id);
                                urlList.Add(publishedContent.UrlSegment);
                            }

                            string url = string.Join("/", urlList);
                            node.SetValue("umbracoUrlAlias", url);

                            sender.SaveAndPublish(node);

                            e.Messages.Add(new EventMessage("Content published", $"Blog post published at {url}"));
                        }

                        else
                        {
                            e.Cancel = true;
                            e.Messages.Add(new EventMessage("Error", "Please add a published date", EventMessageType.Warning));
                        }
                    }
                }
            }
        }
    }
}
```

This worked as a temporary effort, but trying to link to these pages from the Umbraco backoffice ended up being tricky as the custom slug was never used, without specifically using `umbracoUrlAlias` instead of `Url()`.

## The actual solution!

After searching and having a look around the Umbraco documentation I ended up finding the page on Umbraco's [outbound request pipeline](https://our.umbraco.com/documentation/reference/routing/Request-Pipeline/outbound-pipeline#custom-url-provider) which shows an example of writing a custom URL for a doctype.

From this I managed to build my own one which works on the same principle as my original attempt, getting the `publishedDate` field, grabbing the month and year and generating a URL; it inherits from Umbraco's built in `DefaultUrlProvider`.

```csharp
public class BlogUrlProvider : DefaultUrlProvider
{
    // Inject some dependencies that we need later on
    public BlogUrlProvider(
      IRequestHandlerSection requestSettings,
      ILogger logger,
      IGlobalSettings globalSettings,
      ISiteDomainHelper siteDomainHelper
    ) : base(requestSettings, logger, globalSettings, siteDomainHelper) { }

    public override UrlInfo GetUrl(
      UmbracoContext umbracoContext,
      IPublishedContent content,
      UrlMode mode,
      string culture,
      Uri current)
    {
        // If we've got a node and matches the doctype we're after
        if (content != null && content.ContentType.Alias == "blogPost")
        {
            // Cast page to one of my Umbraco ModelsBuilder models
            BlogPost blogPost = content as BlogPost;

            // Build the URL from the strongly typed date property
            DateTime publishedDate = blogPost.PublishedDate;

            // Check if the date field has a value and it's not the default DateTime
            if (publishedDate != default)
            {
                int year = publishedDate.Year;
                int month = publishedDate.Month;

                // Get the current default URL that Umbraco has generated
                UrlInfo defaultUrlInfo = base.GetUrl(umbracoContext, content, mode, culture, current);

                if (!defaultUrlInfo.IsUrl)
                {
                    return defaultUrlInfo;
                }
                else
                {
                    string aliasUrl = string.Empty;
                    string originalUrl = defaultUrlInfo.Text;
                    string[] originalUrlSplit = new string[] { };

                    // You can call `Url(mode: UrlMode.Absolute)` in some places, this handles that
                    if (mode == UrlMode.Absolute)
                    {
                        Uri uri = new Uri(originalUrl);
                        aliasUrl += $"{uri.Scheme}{Uri.SchemeDelimiter}{uri.Host}";

                        if (uri.Port != 80 || uri.Port != 443)
                        {
                            aliasUrl += $":{uri.Port}";
                        }

                        originalUrlSplit = uri.LocalPath.Split('/');
                    }
                    else
                    {
                        originalUrlSplit = originalUrl.Split('/');
                    }

                    aliasUrl += $"/{originalUrlSplit[1]}/{year}/{month.ToString("00")}/{originalUrlSplit[2]}";
                    return new UrlInfo(aliasUrl, true, culture);
                }
            }
        }

        return null;
    }

    // Make a reference to the other default function
    public override IEnumerable<UrlInfo> GetOtherUrls(UmbracoContext umbracoContext, int id, Uri current)
    {
        return base.GetOtherUrls(umbracoContext, id, current);
    }
}
```

This will then have to be composed so Umbraco can use it to generate the correct URL.

```csharp
[RuntimeLevel(MinLevel = RuntimeLevel.Run)]
public class UrlComposer : IComposer
{
    public void Compose(Composition composition)
    {
        composition.UrlProviders().Insert<BlogUrlProvider>();
    }
}
```

After I had implemented this, I was getting the correct URLs showing in local! However, if I tried to publish the page in live or visit the URL, it wasn't loading. After some reading and debugging, I figured out this was happening because I was missing the matching content finder that Umbraco needed to know where to route the request.

<figure class="c-figure">
  <img src="/assets/images/blog/2020-08-30/photo1.png" alt="The Umbraco backoffice showing the correct URL for a blog post" loading="lazy">
  <figcaption>The Umbraco backoffice showing the correct URL for a blog post</figcaption>
</figure>

The basics of what's happening here is going through the tree and finding a node where the generated URL matches the incoming URL.

```csharp
public class BlogContentFinder : IContentFinder
{
    public bool TryFindContent(PublishedRequest request)
    {
        string path = request.Uri.GetAbsolutePathDecoded();

        // We're only interested in anything that starts with /blog
        if (!path.StartsWith("/blog"))
            return false; // not found

        // Find the root blog node
        IPublishedContent blogPage = request.UmbracoContext.Content.GetByXPath("root//homePage//blogsPage").FirstOrDefault();
        if (blogPage != null)
        {
            // Get all blogpost children
            var children = blogPage.Children<BlogPost>().OrderByDescending(x => x.PublishedDate);
            if (children.Any())
            {
                // Find the specific one we're after
                var result = children.Where(x => x.Url == path).FirstOrDefault();
                if (result != null)
                {
                    request.PublishedContent = result;
                    return true;
                }
            }
        }

        return false;
    }
}
```

Again, this needs to be composed so that Umbraco can use it...

```csharp
[RuntimeLevel(MinLevel = RuntimeLevel.Run)]
public class ContentFinderComposer : IUserComposer
{
    public void Compose(Composition composition)
    {
        composition.ContentFinders().InsertBefore<ContentFinderByUrl, BlogContentFinder>();
    }
}
```

And voila! Your page will be published with a custom URL, with no intervention needed by your content editors.

## Further reading
- [Modify Umbraco URLs with the UrlProvider and ContentFinder - 24days](https://24days.in/umbraco-cms/2014/urlprovider-and-contentfinder/)

## Updates
### Update 1
As [Stefan Kip kindly pointed out on Twitter](https://twitter.com/kipusoep/status/1300750077724626944), if you do wish to use `umbracoUrlAlias` and let your content editors control the generated URL a bit more, you can [use this `AliasUrlProvider`](https://gist.github.com/stefankip/e00d50a5c4711a29269c88049fc1976b).

### Update 2
Check out [part 2 of this blog series](/blog/umbraco-url-rewriting-part-2)!