---
# layout: post
title: Dark Mode and CSS Media Queries
excerpt: Dark mode is all the rage these days.
pubDate: 2018-10-30
slug: "dark-mode-css-media-queries"
---

<p class="lead">Dark mode is all the rage these days.</p>

Windows has had one for a while, Apple have just released support with macOS Mojave and the latest version of [Safari Technology Preview](https://webkit.org/blog/8475/release-notes-for-safari-technology-preview-68/) now supports adjusting your site's CSS based on whether you've toggled dark mode on.

The media query in question is `prefers-color-scheme: light | dark` and is part of [Media Queries Level 5](https://drafts.csswg.org/mediaqueries-5/#prefers-color-scheme), currently a draft spec. I've put it into use on this site to have a play around with; here's the code I use to switch the colours with CSS variables.

```css
:root {
  --background: #fafafa;
  --text: #212121;
  --brand: #fbe26d;
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #212121;
    --text: #fafafa;
  }
}

body {
  color: var(--text);
  background-color: var(--background);
}
```

I think the results are pretty great! See the video below...

<video controls muted>
  <source type="video/mp4" src="/assets/videos/blog/2018-10-30/darkmode.mp4">
  <source type="video/webm" src="/assets/videos/blog/2018-10-30/darkmode.webm">
</video>

You can give it a try yourself if you're using macOS Mojave and the latest Safari Technology Preview, but I don't imagine it will be long until other browser makers bring in developmental support. There's a lot of potential here but as with everything it's worth using in an appropriate, sparing way.

## UPDATE: 21st May 2019
Dark mode support has now come to Firefox desktop! (v67)

## UPDATE: 31st July 2019
Dark mode is now supported in Chrome 76.