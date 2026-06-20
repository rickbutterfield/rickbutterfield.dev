import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { client, ContentService, type BlogPostContentModel, type ProjectPostContentModel, type SpeakingPostContentModel, type HomePageContentModel, type BlogsPageContentModel, type ProjectsPageContentModel, type SpeakingPageContentModel, type ContentPageContentModel, type IApiContentResponseModel } from './api';
import type { ZodType } from 'astro/zod';

client.setConfig({ baseUrl: import.meta.env.PUBLIC_BASE_URL });

const blog = defineCollection({
  loader: async() => {
    const response = await ContentService.queryV20({
      query: {
        filter: ["contentType:blogPost"],
        sort: ["publishedDate:desc"],
        take: 100,
        expand: "properties[$all[properties[image]]]",
      }
    });

    return (response.data.items as BlogPostContentModel[]).map((item) => ({
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

const homePage = defineCollection({
  loader: async() => {
    const response = await ContentService.queryV20({
      query: {
        filter: ["contentType:homePage"],
        expand: "properties[$all[properties[image]]]",
      }
    });

    return (response.data.items as HomePageContentModel[]).map((item) => ({
      id: item.id,
      name: item.name,
      content: item,
    }));
  },
  schema: z.object({
    id: z.string(),
    name: z.string(),
    content: z.any() as ZodType<HomePageContentModel>,
  })
});

const blogsPage = defineCollection({
  loader: async() => {
    const response = await ContentService.queryV20({
      query: {
        filter: ["contentType:blogsPage"],
      }
    });

    return (response.data.items as BlogsPageContentModel[]).map((item) => ({
      id: item.id,
      name: item.name,
      content: item,
    }));
  },
  schema: z.object({
    id: z.string(),
    name: z.string(),
    content: z.any() as ZodType<BlogsPageContentModel>,
  })
});

const projectsPage = defineCollection({
  loader: async() => {
    const response = await ContentService.queryV20({
      query: {
        filter: ["contentType:projectsPage"],
      }
    });

    return (response.data.items as ProjectsPageContentModel[]).map((item) => ({
      id: item.id,
      name: item.name,
      content: item,
    }));
  },
  schema: z.object({
    id: z.string(),
    name: z.string(),
    content: z.any() as ZodType<ProjectsPageContentModel>,
  })
});

const speakingPage = defineCollection({
  loader: async() => {
    const response = await ContentService.queryV20({
      query: {
        filter: ["contentType:speakingPage"],
      }
    });

    return (response.data.items as SpeakingPageContentModel[]).map((item) => ({
      id: item.id,
      name: item.name,
      content: item,
    }));
  },
  schema: z.object({
    id: z.string(),
    name: z.string(),
    content: z.any() as ZodType<SpeakingPageContentModel>,
  })
});

const contentPages = defineCollection({
  loader: async() => {
    const response = await ContentService.queryV20({
      query: {
        filter: ["contentType:contentPage"],
        expand: "all",
      }
    });

    return (response.data.items as ContentPageContentModel[]).map((item) => ({
      id: item.id,
      name: item.name,
      slug: item.route.path.replaceAll("/", ""),
      content: item,
    }));
  },
  schema: z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    content: z.any() as ZodType<ContentPageContentModel>,
  })
});

const projects = defineCollection({
  loader: async() => {
    const response = await ContentService.queryV20({
      query: {
        filter: ["contentType:projectPost"],
        sort: ["sortOrder:asc"],
      }
    });

    return (response.data.items as ProjectPostContentModel[]).map((item, index) => ({
      id: item.id,
      name: item.name,
      slug: item.route.path,
      order: index,
      content: item,
    }));
  },
  schema: z.object({
    id: z.string(),
    slug: z.string(),
    name: z.string(),
    order: z.number(),
    content: z.any() as ZodType<ProjectPostContentModel>,
  })
});

const speaking = defineCollection({
  loader: async() => {
    const response = await ContentService.queryV20({
      query: {
        filter: ["contentType:speakingPost"],
        sort: ["eventDate:desc"],
        expand: 'properties[$all[properties[featuredImage]]]',
      }
    });

    return (response.data.items as SpeakingPostContentModel[]).map((item) => ({
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

const navigation = defineCollection({
  loader: async() => {
    // First get the homepage to find its ID
    const homeResponse = await ContentService.queryV20({
      query: {
        filter: ["contentType:homePage"],
      }
    });
    const homePageId = homeResponse.data.items[0].id;

    // Then fetch children of homepage for navigation
    const response = await ContentService.queryV20({
      query: {
        fetch: `children:${homePageId}`,
        sort: ["sortOrder:asc"],
      }
    });

    return response.data.items.map((item: IApiContentResponseModel) => ({
      id: item.id,
      name: item.name,
      path: item.route.path,
    }));
  },
  schema: z.object({
    id: z.string(),
    name: z.string(),
    path: z.string(),
  })
});

export const collections = { blog, projects, speaking, homePage, blogsPage, projectsPage, speakingPage, contentPages, navigation };