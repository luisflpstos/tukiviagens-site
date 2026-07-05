// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import vercel from '@astrojs/vercel';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { rehypeComparisonTables } from './src/lib/rehype-comparison-tables.ts';
import { getRouteByPath } from './src/lib/site-routes.ts';

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
            filter: (page) => {
              if (page.includes('/lp/')) return false;
              try {
                const route = getRouteByPath(new URL(page).pathname);
                if (route?.status === 'planned') return false;
              } catch {
                /* ignore malformed URLs */
              }
              return true;
            },
          }),
        ]),
  ],

  redirects: {
    '/destinos/olimpia/': '/olimpia/',
  },
});