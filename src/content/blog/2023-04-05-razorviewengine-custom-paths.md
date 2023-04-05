---
title: RazorViewEngine custom search paths for Umbraco grid partial views
excerpt: I have been trying to add some new functionality to my BlockPreview package to remove some magic strings...
pubDate: 2023-04-05
slug: "razorviewengine-custom-paths"
---

<p class="lead">I have been trying to add some new functionality to my BlockPreview package to remove some magic strings.</p>

As of version 1.1.2, the package searches for partial views by using magic strings of the actual paths in the file system:

```csharp
if (isGrid)
{
    partialPath = $"/Views/Partials/blockgrid/Components/{documentTypeAlias}.cshtml";
}
else
{
    partialPath = $"/Views/Partials/blocklist/Components/{documentTypeAlias}.cshtml";
}
```

An [issue raised by 37Stars on GitHub](https://github.com/rickbutterfield/Umbraco.Community.BlockPreview/issues/14) posed a great question... 
> Instead of hardcoding the path for views to "/Views/Partials/blockgrid/Components/{contentAlias}.cshtml" or "/Views/Partials/blocklist/Components/{contentAlias}.cshtml", use the Razor Engine to find the view.
> 
> Changing line 120 in BackOfficePreviewService.cs:
> 
> `string partialPath = _razorViewEngine.FindView(controllerContext, contentAlias, false).ViewName;`

I gave this a go! But unfortunately the `RazorViewEngine` was never able to find the files inside `/Views/Partials/blockgrid` because they aren't a default search path. Typically it's searching for things inside `/Views`, `/Views/Partials`, `/Views/Shared`, etc.

So how do we tell it to search the paths we want? After a bit of Googling and talking to ChatGPT, I landed on adding a custom `ViewLocationExpander`. Here's my first attempt at it:

```csharp
public class BlockViewEngineOptionsSetup : IConfigureOptions<RazorViewEngineOptions>
{
    public void Configure(RazorViewEngineOptions options)
    {
        if (options == null)
        {
            throw new ArgumentNullException(nameof(options));
        }

        options.ViewLocationExpanders.Add(new BlockViewLocationExpander());
    }

    public class BlockViewLocationExpander : IViewLocationExpander
    {
        public IEnumerable<string> ExpandViewLocations(
            ViewLocationExpanderContext context, IEnumerable<string> viewLocations)
        {
            string[] blockViewLocations =
            {
                "/Views/Partials/blockgrid/Components/{0}.cshtml",
                "/Views/Partials/blocklist/Components/{0}.cshtml"
            };

            viewLocations = blockViewLocations.Concat(viewLocations);

            return viewLocations;
        }

        // not a dynamic expander
        public void PopulateValues(ViewLocationExpanderContext context)
        {
        }
    }
}
```

What this code is doing is telling the `RazorViewEngine` to check the paths I'm adding when it's trying to run `FindView()`. 

I attempted to compose this in a few ways as shown in many examples you'll see across the web:
```csharp
public class Startup : IComposer
{
    public void Compose(IUmbracoBuilder builder)
    {
        builder.Services.ConfigureOptions<BlockViewEngineOptionsSetup>();
        builder.Configure<RazorViewEngineOptions>(options =>
        {
            options.ViewLocationExpanders.Add(new BlockViewLocationExpander());
        });
    }
}
```

None of this was cutting it. The code was being hit in my `Startup` but the actual code running inside of `BlockViewEngineOptionsSetup` was never hit when trying to call `FindView()`.

After some more Googling, [this GitHub issue](https://github.com/umbraco/Umbraco-CMS/issues/12157) pointed me to the fact that it would have to be composed _before_ `AddWebsite()` is called in `ConfigureServices` in the main `Startup.cs` file.

I reworked the code and ended up needing to use an extension method for `IUmbracoBuilder` to make it work.

```csharp
public static class BlockPreviewUmbracoBuilderExtensions
{
    public static IUmbracoBuilder AddBlockPreview(this IUmbracoBuilder builder)
    {
        ...
        builder.Services.ConfigureOptions<BlockViewEngineOptionsSetup>();
        return builder;
    }
}
```

And then composed in my site's `ConfigureServices` in `Startup.cs`...

```diff
public void ConfigureServices(IServiceCollection services)
{
    services.AddUmbraco(_env, _config)
        .AddBackOffice()
+       .AddBlockPreview()
        .AddWebsite()
        .AddComposers()
        .Build();
}
```

And it works! When calling `FindView`, I now get results from the `/blockgrid` and `/blocklist` folders.

<figure class="c-figure">
  <img src="/assets/images/blog/2023-04-05/screenshot.png" alt="Visual Studio showing viewResult has found the partial view we were looking for" loading="lazy">
  <figcaption>"Visual Studio showing viewResult has found the partial view we were looking for</figcaption>
</figure>

Watch out for this landing in v1.2.0 of [Umbraco.Community.BlockPreview](https://github.com/rickbutterfield/Umbraco.Community.BlockPreview) soon!