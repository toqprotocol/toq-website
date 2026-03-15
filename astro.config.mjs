// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import toqTheme from './src/themes/toq-light.json';

// https://astro.build/config
export default defineConfig({
  integrations: [starlight({
			title: 'toq protocol',
			customCss: ['./src/styles/global.css'],
			head: [
				{ tag: 'link', attrs: { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' } },
				{ tag: 'link', attrs: { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico', sizes: '32x32' } },
				{ tag: 'link', attrs: { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' } },
				{ tag: 'meta', attrs: { property: 'og:image', content: 'https://toq.dev/og.png' } },
				{ tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
				{ tag: 'meta', attrs: { name: 'twitter:image', content: 'https://toq.dev/og.png' } },
				{ tag: 'link', attrs: { rel: 'preload', href: '/fonts/DMSans-latin.woff2', as: 'font', type: 'font/woff2', crossorigin: true } },
				{ tag: 'link', attrs: { rel: 'preload', href: '/fonts/DMMono-Regular.woff2', as: 'font', type: 'font/woff2', crossorigin: true } },
				{ tag: 'link', attrs: { rel: 'preload', href: '/fonts/AppleGaramond.woff2', as: 'font', type: 'font/woff2', crossorigin: true } },
				{ tag: 'script', content: 'var from=sessionStorage.getItem("toq-from");sessionStorage.setItem("toq-from","docs");if(from==="landing"){document.documentElement.style.opacity="0";document.documentElement.style.transition="opacity 0.2s ease-in-out";addEventListener("DOMContentLoaded",()=>{document.documentElement.style.opacity="1"})}addEventListener("pagehide",()=>{document.documentElement.style.transition="none";document.documentElement.style.opacity="0"});addEventListener("pageshow",(e)=>{if(e.persisted){document.documentElement.style.transition="opacity 0.2s ease-in-out";requestAnimationFrame(()=>{requestAnimationFrame(()=>{document.documentElement.style.opacity="1"})})}});addEventListener("DOMContentLoaded",()=>{var t=document.querySelector(".site-title");if(t){var a=t.closest("a");if(a)a.addEventListener("click",e=>{e.preventDefault();document.documentElement.style.transition="opacity 0.2s ease-in-out";document.documentElement.style.opacity="0";setTimeout(()=>{window.location.href="/"},200)})}})' },
			],
			expressiveCode: { themes: [toqTheme], minSyntaxHighlightingColorContrast: 0 },
			components: {
				ThemeProvider: './src/components/ForceLightTheme.astro',
				ThemeSelect: './src/components/EmptyComponent.astro',
			},
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/toqprotocol' }],
			sidebar: [
          {
              label: 'Getting Started',
              items: [
                  { label: 'Overview', slug: 'getting-started/overview' },
                  { label: 'Alpha Notice', slug: 'getting-started/alpha-notice' },
                  { label: 'Quickstart', slug: 'getting-started/quickstart' },
                  { label: 'Concepts', slug: 'getting-started/concepts' },
              ],
          },
          {
              label: 'Guides',
              items: [
                  { label: 'Setup', slug: 'guides/setup' },
                  { label: 'Connection Modes', slug: 'guides/connection-modes' },
                  { label: 'Message Handlers', slug: 'guides/message-handlers' },
                  { label: 'Conversational Handlers', slug: 'guides/conversational-handlers' },
                  { label: 'Framework Integration', slug: 'guides/frameworks' },
                  { label: 'Deployment', slug: 'guides/deployment' },
              ],
          },
          {
              label: 'SDKs',
              items: [
                  { label: 'Python', slug: 'sdks/python' },
                  { label: 'Node.js', slug: 'sdks/node' },
                  { label: 'Go', slug: 'sdks/go' },
              ],
          },
          {
              label: 'CLI Reference',
              items: [
                  { label: 'Commands', slug: 'cli/commands' },
              ],
          },
          {
              label: 'API Reference',
              autogenerate: { directory: 'api' },
          },
          {
              label: 'Specification',
              items: [
                  { label: 'Protocol', slug: 'specification/protocol' },
              ],
          },
          {
              label: 'Bridge',
              items: [
                  { label: 'A2A Bridge', slug: 'bridge/a2a' },
              ],
          },
			],
  }), react()],

  vite: {
    plugins: [tailwindcss()],
  },
});