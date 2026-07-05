// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import vercel from '@astrojs/vercel';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { rehypeComparisonTables } from './src/lib/rehype-comparison-tables.ts';

const blockIndexing = process.env.PUBLIC_BLOCK_INDEXING === 'true';

// https://astro.build/config
export default defineConfig({
  site: process.env.PUBLIC_SITE_URL ?? 'http://localhost:4321',
  trailingSlash: 'always',
  output: 'static',
  adapter: vercel(),

  markdown: {
    processor: unified({
      rehypePlugins: [rehypeComparisonTables],
    }),
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    ...(blockIndexing
      ? []
      : [
          sitemap({
            filter: (page) => !page.includes('/lp/'),
          }),
        ]),
  ],

  redirects: {
    '/destinos/olimpia/': '/olimpia/',
  },
});