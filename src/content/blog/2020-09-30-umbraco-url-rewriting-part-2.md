---
# # layout: post
title:  URL rewriting in Umbraco 8 — Part 2
excerpt: A few weeks ago, I posted a blog about using IUrlProvider in Umbraco 8 to generate custom URLs for blog posts.
pubDate: 2020-09-30
slug: "umbraco-url-rewriting-part-2"
---

<p class="lead">A few weeks ago, I posted a blog about using <code>IUrlProvider</code> in Umbraco 8 to generate custom URLs for blog posts.</p>

I posted it online and it was fairly well received! On the [Umbraco Web Developers](https://www.facebook.com/groups/202933450108554/permalink/1114634335605123) group on Facebook, Aaron Sadler added a great thought...

<figure class="c-figure">
  <img src="/assets/images/blog/2020-09-07/photo1.png" alt="Aaron Sadler on Facebook writing 'An idea to expand on this, would be to return all reliant pages in the year / month slug'" loading="lazy">
  <figcaption>Aaron Sadler on Facebook writing 'An idea to expand on this, would be to return all reliant pages in the year / month slug'</figcaption>
</figure>

...and that's exactly what I decided to do! I knew a little bit about virtual nodes in Umbraco, so the [routing documentation](https://our.umbraco.com/documentation/reference/routing/) was my first port of call. This took a bit of trial and error to figure out what needed to happen in what order, so we're working from the ground up here rather than diving straight into routing first.

## Virtual Pages
Firsly, we create a `BlogsVirtualPage.cs` file! It inherits from `PublishedContentWrapped` and is in effect a custom version of an `IPublishedContent` model. We're going to pass year and month values into this in a little bit and generate the correct URLs for routing.

```csharp
public class BlogsVirtualPage : PublishedContentWrapped
{
    private readonly IPublishedContent _blogPublishedContent;
    private int _month = 0;
    private int _year = 0;

    public BlogsVirtualPage(IPublishedContent blogPublishedContent, string year = "", string month = "") : base(blogPublishedContent)
    {
        if (!string.IsNullOrEmpty(year))
        {
            int.TryParse(year, out _year);
        }

        if (!string.IsNullOrEmpty(month))
        {
            int.TryParse(month, out _month);
        }

        _blogPublishedContent = blogPublishedContent;
    }

    public override IPublishedContent Parent
    {
        get
        {
            return _blogPublishedContent.Parent;
        }
    }

    public override string Url
    {
        get
        {
            if (_year != 0)
            {
                if (_month != 0)
                {
                    return base.Url + $"/{_year}/{_month.ToString("00")}";
                }

                return base.Url + $"/{_year}";
            }

            return base.Url;
        }
    }
}
```

## Route Handler
The next thing we need to do is create a class that will handle our custom routing. This takes an `IPublishedContent` node coming in, and turns it into the `BlogsVirtualPage` that we created earlier. We're also checking for 

```csharp
public class BlogsVirtualRouteHandler : UmbracoVirtualNodeRouteHandler
{
    private readonly IPublishedContent _node;

    public BlogsVirtualRouteHandler(IPublishedContent node)
    {
        _node = node;
    }

    protected override IPublishedContent FindContent(RequestContext requestContext, UmbracoContext umbracoContext)
    {
        string year = string.Empty;
        string month = string.Empty;

        try
        {
            year = umbracoContext.HttpContext.Request.Url.Segments[2].TrimEnd('/');
        }
        catch (Exception ex) { }

        try
        {
            month = umbracoContext.HttpContext.Request.Url.Segments[3].TrimEnd('/');
        }
        catch (Exception ex) { }

        return new BlogsVirtualPage(_node, year, month);
    }
}
```

## Routing Component
Thirdly, we're creating a custom route for Umbraco to intercept when someone tries to go to a URL that matches `/blog/{year}` or `/blog/{year}/{month}`. Here, we're telling anything that comes in matching to go to the `BlogsByYear` or `BlogsByMonthAndYear` action of our `BlogsPage` controller&mdash;that's next! You'll see that we're now using our `BlogsVirtualRouteHandler` that we created earlier as well.

```csharp
public class CustomRouteComponent : IComponent
{
    private readonly IUmbracoContextFactory _context;

    public CustomRouteComponent(IUmbracoContextFactory context)
    {
        _context = context;
    }

    public void Initialize()
    {
        using (UmbracoContextReference cref = _context.EnsureUmbracoContext())
        {
            IPublishedContentCache umbracoHelper = cref.UmbracoContext.Content;
            IPublishedContent blogPage = umbracoHelper.GetByXPath("root//homePage//blogsPage").FirstOrDefault();

            RouteTable.Routes.MapUmbracoRoute("BlogsByYear", "blog/{year}", new
            {
                controller = "BlogsPage",
                action = "BlogsByYear",
                year = UrlParameter.Optional
            }, new BlogsVirtualRouteHandler(blogPage));

            RouteTable.Routes.MapUmbracoRoute("BlogsByYearCustomRoute", "blog/{year}/{month}", new
            {
                controller = "BlogsPage",
                action = "BlogsByMonthAndYear",
                year = UrlParameter.Optional,
                month = UrlParameter.Optional
            }, new BlogsVirtualRouteHandler(blogPage));
        }            
    }

    public void Terminate()
    {
        throw new System.NotImplementedException();
    }
}
```

This component also needs to be composed in the usual Umbraco 8 way.

```csharp
[RuntimeLevel(MinLevel = RuntimeLevel.Run)]
public class CustomRouteComposer : IUserComposer
{
    public void Compose(Composition composition)
    {
        composition.Components().Append<CustomRouteComponent>();
    }
}
```

## Route Hijacking
If you tried to run the solution now, you could get to the year and month URLs, but no content on the page would change. We're attempting to handle if anyone accesses the URLs `/blog/{year}` or `/blog/{year}/{month}`, so now we need a controller to do something with those requests.

There's Umbraco documentation with information on [how custom routes and route hijacking works](https://our.umbraco.com/documentation/reference/routing/custom-controllers), so we're following best practice here.

In a nutshell, if we're trying to access a page that has a doctype of `BlogsPage`, Umbraco will try to find a matching `RenderMvcController` before defaulting to its default one. What we're doing here is intercepting that request and telling Umbraco to do something different.

```csharp
public class BlogsPageController : RenderMvcController
{
    public override ActionResult Index(ContentModel model)
    {
        return CurrentTemplate(new BlogsPageViewModel(model.Content));
    }

    public ActionResult BlogsByYear(ContentModel model, string year = "")
    {
        if (string.IsNullOrEmpty(year))
        {
            return View("BlogsPage", new BlogsPageViewModel(model.Content));
        }
        else
        {
            int yearInt = int.Parse(year);

            List<BlogPost> children = model.Content.Children<BlogPost>().Where(x => x.PublishedDate.Year == yearInt).ToList();

            BlogsPageViewModel blogsPageViewModel = new BlogsPageViewModel(model.Content, children)
            {
                Year = yearInt
            };

            return View("BlogsPage", blogsPageViewModel);
        }
    }

    public ActionResult BlogsByMonthAndYear(ContentModel model, string year = "", string month = "")
    {
        if (string.IsNullOrEmpty(year) && string.IsNullOrEmpty(month))
        {
            return View("BlogsPage", new BlogsPageViewModel(model.Content));
        }
        else
        {
            int yearInt = int.Parse(year);
            int monthInt = int.Parse(month);

            List<BlogPost> children = model.Content.Children<BlogPost>().Where(x => x.PublishedDate.Year == yearInt && x.PublishedDate.Month == monthInt).ToList();

            BlogsPageViewModel blogsPageViewModel = new BlogsPageViewModel(model.Content, children)
            {
                Year = yearInt,
                Month = monthInt
            };

            return View("BlogsPage", blogsPageViewModel);
        }
    }
}
```

The eagle eyed among you will have spotted that we're returning something different for our `Index` call as well. If we don't do this, Umbraco won't know what to do with someone trying to load the URL `/blog`. So we have to take it into our own hands and change the way our template loads!

## View Models
We need to create a custom model that both inherits from our Umbraco generated model as well as working with our new controller. So I created a class called `BlogsPageViewModel`!

```csharp
public class BlogsPageViewModel : BlogsPage
{
    public BlogsPageViewModel(IPublishedContent content) : base(content)
    {
        this.BlogPosts = content.Children<BlogPost>().ToList();
    }

    public BlogsPageViewModel(IPublishedContent content, List<BlogPost> blogPosts = null) : base(content)
    {
        this.BlogPosts = blogPosts ?? content.Children<BlogPost>().ToList();
    }

    public int Year { get; set; }
    public int Month { get; set; }
    public List<BlogPost> BlogPosts { get; set; }
}
```

As you can see this is fairly simply just converting from one model type to another, but is crucial for us being able to return the correct child pages depending on whether you're coming in on a year or month page. One final tweak we need to make is changing our template to inherit from this new model, rather than the Umbraco generated one.

```csharp
@inherits UmbracoViewPage<BlogsPageViewModel>
```

You could also do this in a slightly different way, something along these lines at the top of your view...
```csharp
var model = Model as BlogsPageViewModel;
```

And that should be it! You should have working month and year blog pages. The same logic could be applied to categories, tags, authors or anything else you can think of!

<hr/>

## Further reading
- [How to create a virtual node in Umbraco](https://stackoverflow.com/a/35698197)