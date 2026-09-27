import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { posts } from './src/data/posts.ts';

// Map insight post URLs to their real last-modified dates for sitemap <lastmod>
const postLastmod = Object.fromEntries(
  Object.entries(posts).map(([slug, p]) => [
    `https://newmediatek.net/insights/${slug}/`,
    new Date(p.updatedDate || p.publishDate),
  ])
);

// https://astro.build/config
export default defineConfig({
  site: 'https://newmediatek.net',
  integrations: [
    react(),
    sitemap({
      // Sitemap must contain only indexable URLs (utility pages are noindexed)
      filter: (page) => !page.includes('/admin') && !page.includes('/success'),
      // Emit <lastmod> only where we have a real content-change date (posts).
      // Other pages get no lastmod rather than a fabricated build-time stamp.
      serialize: (item) => {
        const lastmod = postLastmod[item.url];
        return lastmod ? { ...item, lastmod } : item;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  server: {
    port: 9195,
    host: true
  }
});
