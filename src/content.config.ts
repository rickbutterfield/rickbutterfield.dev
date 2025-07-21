import { defineCollection, z } from 'astro:content';
import { ContentService, OpenAPI, type BlogPostContentModel, type ProjectPostContentModel, type SpeakingPostContentModel } from './api';
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

const projects = defineCollection({
  loader: async() => {
    const response = await ContentService.queryV20({
      filter: ["contentType:projectPost"],
      sort: ["sortOrder:asc"],
    });

    return response.items.map((item: ProjectPostContentModel) => ({
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
    content: z.any() as ZodType<ProjectPostContentModel>,
  })
});

const speaking = defineCollection({
  loader: async() => {
    const response = await ContentService.queryV20({
      filter: ["contentType:speakingPost"],
      sort: ["eventDate:desc"],
      expand: 'properties[$all[properties[featuredImage]]]',
    });

    return response.items.map((item: SpeakingPostContentModel) => ({
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
    content: z.any() as ZodType<SpeakingPostContentModel>,
  })
});

export const collections = { blog, projects, speaking };