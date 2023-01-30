---
# layout: post
title: Removing emoji in a C# .NET JsonResult 
excerpt: I recently came across an issue at work where a JsonResult couldn't be returned because of emojis within a string
pubDate: 2019-03-06
---

<p class="lead">I recently came across an issue at work where a <code>JsonResult</code> couldn't be returned because of emojis within a string.</p>

The error I was getting looked something like this:

```javascript
"Unable to translate Unicode character \\uD83C at index 485 to specified code page."
```

After some digging and Googling I came across a number of ways to remove emojis from a string which seems to have done the trick. The example in my case was trying to load tweets and spit them out as JSON.

```csharp
var description = Regex.Replace(tweet.TextAsHtml, @"\p{Cs}", "");
```

The second property of the `Regex.Replace` is the key part&mdash;`@"\p{Cs}"`. This string is telling the replace to remove invisible code characters, specifically [one half of a surrogate pair in UTF-16 encoding](https://www.regular-expressions.info/unicode.html) in this case.

Hope this is helpful for someone!
