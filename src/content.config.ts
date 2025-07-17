import { defineCollection, z } from 'astro:content';
import { ContentService, OpenAPI, type BlogPostContentModel } from './api';
import type { ZodType } from 'astro/zod';

OpenAPI.BASE = import.meta.env.PUBLIC_BASE_URL;
const blog = defineCollection({
  loader: async() => {
    const response = await ContentService.queryV20({
      filter: ["contentType:blogPost"],
      sort: ["publishedDate:desc"],
      take: 100,
    });

    return response.items.map((item: BlogPostContentModel) => ({
      id: item.id,
      name: item.name,
      slug: item.route.path,
      content: item,
    }));
  },
  schema: z.object({
    id: z.string(),
    slug: z.string(),
    name: z.string(),
    content: z.any() as ZodType<BlogPostContentModel>,
  })
});

export const collections = { blog };