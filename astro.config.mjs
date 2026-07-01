// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

const blockIndexing = process.env.PUBLIC_BLOCK_INDEXING === 'true';

// https://astro.build/config
export default defineConfig({
  site: process.env.PUBLIC_SITE_URL ?? 'http://localhost:4321',
  trailingSlash: 'always',

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