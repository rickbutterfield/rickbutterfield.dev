import rss, { type RSSFeedItem } from '@astrojs/rss';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';
import { ContentService, OpenAPI, type ApiBlockGridItemModel, type ApiBlockGridModel, type BlogPostContentModel, type ImageWithCaptionElementModel, type RichTextElementModel, type RichTextPropertiesModel, type YouTubeVideoElementModel } from '@/api';
import { Marked } from 'marked';

const renderGridContent = (grid: ApiBlockGridModel, content: string) => {
  if (grid.items.length !== 0) {
    let html: string = '';

    // For RSS feeds, we don't need syntax highlighting, just plain text/HTML
    const customMarked = new Marked({
      renderer: {
        code({ text, lang }: { text: string; lang?: string }) {
          // Return simple pre/code blocks for RSS feeds
          return `<pre><code class="language-${lang || 'text'}">${text.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`;
        }
      }
    });

    grid.items.forEach((item: ApiBlockGridItemModel) => {
      if (item.content.contentType == 'richText') {
        const typedData = item.content as RichTextElementModel;
        html += customMarked.parse(typedData?.properties.content);
      }

      if (item.content.contentType == "imageWithCaption") {
        const typedData = item.content as ImageWithCaptionElementModel;

        const baseUrl = import.meta.env.PUBLIC_BASE_URL_HTTPS;

        let src: string = `${baseUrl}${typedData?.properties?.image[0]?.url}?width=2000&height=1125`;

        if (typedData?.properties?.image[0].focalPoint !== null) {
          src += `&rxy=${typedData?.properties?.image[0].focalPoint.left},${typedData?.properties?.image[0].focalPoint.top}`;
        }

        const caption: string = typedData?.properties?.caption || '';
        const alt: string =
          (typedData?.properties?.image[0]?.properties?.altText as string) ?? caption;

          html +=
          `<figure>
            <img src=${src} alt=${alt} width=${2000} height=${1125} />
            <figcaption>
              ${customMarked.parse(caption)}
              </figcaption>
          </figure>`;
      }

      if (item.content.contentType == "youTubeVideo") {
        const typedData = item.content as YouTubeVideoElementModel;
        
        html +=
          `<iframe src="https://www.youtube-nocookie.com/embed/${typedData.properties.videoID}?autoplay=0&playsinline=1" />`;
      }
    });

    return html;
  }

  return `<p>${content}</p>`;
}

export async function GET(context) {
  OpenAPI.BASE = import.meta.env.PUBLIC_BASE_URL;

  const posts = await ContentService.queryV20({
    filter: ['contentType:blogPost'],
    sort: ['publishedDate:desc']
  });

  const items = posts.items.map((post: BlogPostContentModel) => {
    return {
      title: post.properties?.title,
      link: post.route.path,
      pubDate: new Date(post.properties?.publishedDate),
      description: post.properties?.content ?? "",
      content: renderGridContent(post.properties?.grid, post.properties?.content)
    }
  });

	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: items
	});
}
