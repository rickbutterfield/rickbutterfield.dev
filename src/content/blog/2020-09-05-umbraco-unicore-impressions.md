---
# # layout: post
title:  Umbraco Unicore first impressions
excerpt: On Thursday 3rd September, Umbraco HQ announced the first alpha of Unicore, Umbraco v8 running on .NET Core!
pubDate: 2020-09-05
slug: "umbraco-unicore-impressions"
---

<p class="lead">On Thursday 3rd September, Umbraco HQ announced the first alpha of Unicore, Umbraco v8 running on .NET Core!</p>

<div class="iframe">
  <iframe width="560" height="315" src="https://www.youtube.com/embed/BhCy_fQZ3lQ" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

## What is Unicore?
Unicore is Umbraco's project to get the CMS running on .NET Core. As mentioned in the live stream, the first commits happened in November last year, and they reckon they're about half way through the project as a whole.

## Why .NET Core?
You might be thinking "what the heck is this .NET Core thing I keep hearing about?!" Core is the future of .NET as a whole. Framework&mdash;with a capital F; and what you might traditionally think of as "normal" .NET&mdash;will no longer be worked on and will go into support around November when Core v5 is shipped. As soon as this happens, [Core will become the de-facto standard of .NET](https://devblogs.microsoft.com/dotnet/the-future-of-net-standard/?WT.mc_id=DOP-MVP-4025064), and everything will be renamed to simply... wait for it... .NET v5!

The main draw of Core being the future of the framework is that it works in many more places. Traditionally if you wanted to write in the C# language you were restricted to only working on Microsoft technologies. Now you'll be able to work on macOS, Linux and much more!

## First impressions
Let's try and get this alpha up and running then! If we follow the instructions on the [announcement blog post](https://umbraco.com/blog/net-core-alpha-release/) we can see that it's fairly straightforward. I'm running this on a 2017 MacBook Pro running macOS 10.15 Catalina.

We add a custom Nuget feed to be able to pull the prerelease from...
```powershell
dotnet nuget add source "https://www.myget.org/F/umbracoprereleases/api/v3/index.json" -n "Umbraco Prereleases"
```

...install the Umbraco dotnet template so we can scaffold a release...
```powershell
dotnet new -i Umbraco.Templates::0.5.0-alpha001
```

...and then we can create a new project! The `UmbracoUnicore` is the name of the Visual Studio solution that will be created, as well as the folder we're going to make.
```powershell
dotnet new umbraco -n UmbracoUnicore
```

Once that's done, we can move into the folder the `dotnet` installer created, build and then run.
```powershell
cd UmbracoUnicore
dotnet build
dotnet run
```

Once this is done, we're up and running! The console currently doesn't tell you anything is running&mdash;as mentioned in the blog post&mdash;so we can just go to `http://localhost:5000`. Here's what we get!

<figure class="c-figure">
  <img src="/assets/images/blog/2020-09-04/photo1.png" alt="The Umbraco vNext installer screen running on macOS" loading="lazy">
  <figcaption>The Umbraco vNext installer screen running on macOS</figcaption>
</figure>

As with every Umbraco installation, you go through and enter your details and SQL server details. Once installed, you'll need to type `dotnet run` again into your terminal. This is a known issue listed on the announcement blog post. Refresh your browser and you'll be able to see the login screen, and then we're inside Umbraco!

<figure class="c-figure">
  <img src="/assets/images/blog/2020-09-04/photo2.png" alt="The Umbraco vNext dashboard screen running on macOS" loading="lazy">
  <figcaption>The Umbraco vNext dashboard screen running on macOS!</figcaption>
</figure>

Now we can have a look around the backoffice. At a glance, everything seems QUICK. I'm so impressed that this is Umbraco running natively on macOS! I tried creating a few doctypes, and also importing some from an 8.6 site that's in production, and everything appears to work as intended.

<figure class="c-figure">
  <img src="/assets/images/blog/2020-09-04/photo3.png" alt="Saving a doctype in Umbraco vNext" loading="lazy">
  <figcaption>Saving a doctype in Umbraco vNext</figcaption>
</figure>

At the moment, there is no front end to the site so you're restricted mostly to what can be done in the backoffice, and I'm incredibly excited for this future for Umbraco! As HQ said on the live stream, they need people to be able to go to the edges of Umbraco and try everything; all possible edge cases and functionality.

<figure class="c-figure">
  <img src="/assets/images/blog/2020-09-04/photo4.png" alt="The content tree in Umbraco vNext" loading="lazy">
  <figcaption>The content tree in Umbraco vNext</figcaption>
</figure>

## What's next?
**Test it, test it, test it!** Try and do everything you would normally do with the CMS. Break it. [Raise bugs in GitHub](https://github.com/umbraco/Umbraco-CMS/issues?q=is%3Aopen+is%3Aissue+label%3Aproject%2Fnet-core+). [Pick up some of the up for grabs issues](https://github.com/umbraco/Umbraco-CMS/issues?q=is%3Aopen+is%3Aissue+label%3Acommunity%2Fup-for-grabs+label%3Aproject%2Fnet-core). I've worked with Umbraco for nearly 10 years and I've never actually committed anything to core, but I think now could be the time for me! 😁

There are going to be more alphas released in the coming months to keep testing, and then a stable beta once views are accessible and can be worked on.

[umbraCoffee](https://www.youtube.com/channel/UCF_Ene5-58a3Z55aw8O6Djg) also did a great video deep dive into this as well (in which they also kindly mentioned my [previous blog post!](/blog/umbraco-url-rewriting))

<div class="iframe">
<iframe width="560" height="315" src="https://www.youtube.com/embed/-ceCJZ9Tus0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

What an exciting time to be working with .NET!