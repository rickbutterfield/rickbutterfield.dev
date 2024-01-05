import { OGImageRoute } from 'astro-og-canvas';
import * as api from '@/api';

const config = new api.Configuration({ basePath: import.meta.env.PUBLIC_BASE_URL });
const contentApi = new api.ContentApi(config);

const blogPosts = await contentApi.getContent20({
  filter: ['contentType:blogPost'],
  sort: ['sortOrder:asc']
});

let pages = {};
blogPosts.items.forEach((post: api.BlogPostContentModel) => {
  if (post !== null) {
    const path = post.route?.path.substring(1);
    pages[path] = {
      title: post.properties?.title,
      description: post.properties?.content
    }
  }
});

export const { getStaticPaths, GET } = OGImageRoute({
  // Tell us the name of your dynamic route segment.
  // In this case it’s `route`, because the file is named `[...route].ts`.
  param: 'route',

  // A collection of pages to generate images for.
  // The keys of this object are used to generate the path for that image.
  // In this example, we generate one image at `/open-graph/example.png`.
  pages: pages,

  // For each page, this callback will be used to customize the OpenGraph image.
  getImageOptions: (path, page) => ({
    title: page.title,
    description: page.description,
    bgGradient: [[32,33,35]],
    fonts: ['./public/assets/fonts/AzoSans-Bold.ttf'],
    font: {
      title: {
        families: ['azo-sans-web', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol']
      },
      description: {
        families: ['azo-sans-web', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol']
      }
    },
    border: {
      color: [245, 99, 40],
      width: 20,
      side: 'block-end'
    },
    padding: 48,
    logo: {
      path: './public/assets/images/Rick.jpg',
      size: [100]
    }
  }),
});