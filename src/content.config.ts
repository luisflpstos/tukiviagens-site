import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const seoSchema = z.object({
	title: z.string(),
	description: z.string(),
	image: z.string().optional(),
});

const faqSchema = z.array(
	z.object({
		question: z.string(),
		answer: z.string(),
	}),
);

const hoteis = defineCollection({
	loader: glob({ base: './src/content/hoteis', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		type: z.literal('hotel').default('hotel'),
		cidade: z.string(),
		estado: z.string(),
		categoria: z.string(),
		headline: z.string(),
		description: z.string(),
		whatsapp: z.string(),
		cta: z.string(),
		amenities: z.array(z.string()).default([]),
		images: z.array(z.string()).default([]),
		faq: faqSchema.default([]),
		seo: seoSchema,
	}),
});

const resorts = defineCollection({
	loader: glob({ base: './src/content/resorts', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		type: z.literal('resort').default('resort'),
		cidade: z.string(),
		estado: z.string(),
		categoria: z.string(),
		headline: z.string(),
		description: z.string(),
		whatsapp: z.string(),
		cta: z.string(),
		amenities: z.array(z.string()).default([]),
		images: z.array(z.string()).default([]),
		faq: faqSchema.default([]),
		seo: seoSchema,
	}),
});

const destinos = defineCollection({
	loader: glob({ base: './src/content/destinos', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		type: z.literal('destino').default('destino'),
		estado: z.string(),
		headline: z.string(),
		description: z.string(),
		highlights: z.array(z.string()).default([]),
		whatsapp: z.string(),
		cta: z.string(),
		images: z.array(z.string()).default([]),
		seo: seoSchema,
	}),
});

const landingpages = defineCollection({
	loader: glob({ base: './src/content/landingpages', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		type: z.literal('landingpage').default('landingpage'),
		hotel: z.string(),
		cidade: z.string(),
		estado: z.string(),
		headline: z.string(),
		subheadline: z.string(),
		cta: z.string(),
		whatsapp: z.string(),
		campaign: z.string(),
		channel: z.string(),
		noindex: z.boolean().default(true),
		benefits: z.array(z.string()).default([]),
		faq: faqSchema.default([]),
		seo: seoSchema,
	}),
});

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		publishedAt: z.coerce.date(),
		author: z.string().default('Tuki Viagens'),
		tags: z.array(z.string()).default([]),
		noindex: z.boolean().default(false),
		seo: seoSchema,
	}),
});

export const collections = { hoteis, resorts, destinos, landingpages, blog };
