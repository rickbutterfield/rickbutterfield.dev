import rss, { type RSSFeedItem } from '@astrojs/rss';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';
import { ContentResource, OpenAPI, type ApiBlockGridItemModel, type ApiBlockGridModel, type BlogPostContentModel, type ImageWithCaptionElementModel, type RichTextElementModel, type RichTextPropertiesModel, type YouTubeVideoElementModel } from '@/api';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';

const renderGridContent = (grid: ApiBlockGridModel, content: string) => {
  if (grid.items.length !== 0) {
    let html: string = '';

    const customMarked = new Marked(
      markedHighlight({
        langPrefix: "hljs language-",
        highlight(code, lang, info) {
          const language = hljs.getLanguage(lang) ? lang : "plaintext";
          return hljs.highlight(code, { language }).value;
        },
      }),
    );

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

        const caption: string = typedData?.properties?.caption;
        const alt: string =
          typedData?.properties?.image[0]?.properties?.altText ?? caption;

          html +=
          `<figure class="lg:-mr-32 xl:-mr-48 2xl:-mr-60 3xl:-mr-72">
            <img src=${src} alt=${alt} width=${2000} height=${1125} class="rounded-lg" />
            <figcaption
              class="text-gray-600 dark:text-zinc-400 italic"
            >
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

  const posts = await ContentResource.getContent20({
    filter: ['contentType:blogPost'],
    sort: ['publishedDate:desc']
  });

  const items = posts.items.map((post: BlogPostContentModel) => {
    return {
      title: post.properties?.title,
      link: post.route.path,
      pubDate: new Date(post.properties?.publishedDate),
      description: post.properties?.content,
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
