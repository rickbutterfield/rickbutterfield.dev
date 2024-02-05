import rss from '@astrojs/rss';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';
import { ContentResource, OpenAPI, type BlogPostContentModel } from '@/api';

export async function GET(context) {
  OpenAPI.BASE = import.meta.env.PUBLIC_BASE_URL;

  const posts = await ContentResource.getContent20({
    filter: ['contentType:blogPost'],
    sort: ['publishedDate:desc']
  })

	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: posts.items.map((post: BlogPostContentModel) => {
      return {
        title: post.properties?.title,
        link: post.route.path,
        pubDate: post.properties?.publishedDate,
        description: post.properties?.content,
        content: post.properties?.content
      }
    })
	});
}
