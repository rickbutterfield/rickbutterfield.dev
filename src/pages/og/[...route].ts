import { ContentService, OpenAPI, type BlogPostContentModel } from '@/api';
import { OGImageRoute } from 'astro-og-canvas';

OpenAPI.BASE = import.meta.env.PUBLIC_BASE_URL;

const blogPosts = await ContentService.queryV20({
  filter: ['contentType:blogPost'],
  sort: ['sortOrder:asc'],
  take: 100
});

let pages = {};
blogPosts.items.forEach((post: BlogPostContentModel) => {
  if (post !== null) {
    const path = post.route?.path.substring(1);
    const descriptionMaxLength = 100;
    let descriptionTruncated = post.properties?.content ?? "";
    
    if (descriptionTruncated.length > descriptionMaxLength) {
      descriptionTruncated = descriptionTruncated.slice(0, descriptionMaxLength - 1) + '...';
    }

    pages[path] = {
      title: post.properties?.title,
      description: descriptionTruncated
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
    bgGradient: [[60, 122, 158]],
    fonts: [
      './public/assets/fonts/IBM Plex Sans Var-Roman.ttf',
      './public/assets/fonts/IBM Plex Sans Var-Roman.woff2'
    ],
    font: {
      title: {
        size: 65,
        lineHeight: 1.125,
        color: [255, 255, 255],
        weight: "ExtraBold",
        families: ['IBM Plex Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol']
      },
      description: {
        color: [255, 255, 255],
        weight: "Medium",
        families: ['IBM Plex Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol']
      }
    },
    padding: 48,
    logo: {
      path: './public/assets/images/Rick.jpg',
      size: [100]
    }
  }),
});