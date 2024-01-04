import rss from '@astrojs/rss';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';
import * as api from '@/api';

export async function get(context) {
  const config = new api.Configuration({ basePath: import.meta.env.PUBLIC_BASE_URL });
  const contentApi = new api.ContentApi(config);

  const posts = await contentApi.getContent20({
    filter: ['contentType:blogPost'],
    expand: 'all'
  })

	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: posts.items.map((post: api.BlogPostContentModel) => ({
      title: post.properties?.title,
			link: post.route.path,
      pubDate: post.properties?.publishedDate,
      description: post.properties?.content
		})),
	});
}
