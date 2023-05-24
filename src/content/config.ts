import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
		excerpt: z.string(),
		// Transform string to Date object
		pubDate: z
			.string()
			.or(z.date())
			.transform((val) => new Date(val)),
		updatedDate: z
			.string()
			.optional()
			.transform((str) => (str ? new Date(str) : undefined)),
    draft: z
      .boolean()
      .optional()
	}),
});

const speaking = defineCollection({
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    event: z.string(),
    externalUrl: z.string().url().optional(),
    additionalEvents: z.array(z.object({ name: z.string(), date: z.date(), url: z.string().url().optional() })).optional(),
    // Transform string to Date object
    pubDate: z
      .string()
      .or(z.date())
      .transform((val) => new Date(val)),
    updatedDate: z
      .string()
      .optional()
      .transform((str) => (str ? new Date(str) : undefined)),
    draft: z
      .boolean()
      .optional()
  }),
});

export const collections = { blog, speaking };
