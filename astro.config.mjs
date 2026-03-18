// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import rehypeMermaid from 'rehype-mermaid';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import toqTheme from './src/themes/toq-light.json';

// https://astro.build/config
export default defineConfig({
  markdown: {
    syntaxHighlight: {
      type: 'shiki',
      excludeLangs: ['mermaid'],
    },
    rehypePlugins: [[rehypeMermaid, { strategy: 'img-svg', mermaidConfig: { theme: 'neutral' } }]],
  },
  integrations: [starlight({
			title: 'toq protocol',
			routeMiddleware: './src/routeData.ts',
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
				{ tag: 'script', content: 'addEventListener("pageswap",function(e){if(e.viewTransition&&e.activation){var p=new URL(e.activation.entry.url).pathname;if(p!=="/")e.viewTransition.skipTransition()}});addEventListener("pagereveal",function(e){if(e.viewTransition&&document.referrer){try{if(new URL(document.referrer).pathname!=="/")e.viewTransition.skipTransition()}catch(x){}}})' },
			],
			expressiveCode: { themes: [toqTheme], minSyntaxHighlightingColorContrast: 0 },
			components: {
				ThemeProvider: './src/components/ForceLightTheme.astro',
				ThemeSelect: './src/components/EmptyComponent.astro',
			},
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/toqprotocol' },
				{ icon: 'email', label: 'Email', href: 'mailto:hello@toq.dev' },
			],
			sidebar: [
          {
              label: 'Getting Started',
              items: [
                  { label: 'Overview', slug: 'getting-started/overview' },
                  { label: 'Quickstart', slug: 'getting-started/quickstart' },
                  { label: 'Concepts', slug: 'getting-started/concepts' },
                  { label: 'Alpha Notice', slug: 'getting-started/alpha-notice' },
              ],
          },
          {
              label: 'Guides',
              items: [
                  { label: 'Connection Modes', slug: 'guides/connection-modes' },
                  { label: 'Conversational Handlers', slug: 'guides/conversational-handlers' },
                  { label: 'Message Handlers', slug: 'guides/message-handlers' },
                  { label: 'Remote Agents & DNS', slug: 'guides/remote' },
              ],
          },
          {
              label: 'CLI Reference',
              items: [
                  { label: 'CLI Commands', slug: 'cli/commands' },
              ],
          },
          {
              label: 'Frameworks',
              items: [
                  { label: 'LangChain', slug: 'frameworks/langchain' },
                  { label: 'CrewAI', slug: 'frameworks/crewai' },
                  { label: 'OpenClaw', slug: 'frameworks/openclaw' },
              ],
          },
          {
              label: 'SDKs',
              items: [
                  { label: 'Python SDK', slug: 'sdks/python' },
                  { label: 'Node.js SDK', slug: 'sdks/node' },
                  { label: 'Go SDK', slug: 'sdks/go' },
              ],
          },
          {
              label: 'Interoperability',
              items: [
                  { label: 'A2A Compatibility', slug: 'bridge/a2a' },
              ],
          },
          {
              label: 'API Reference',
              autogenerate: { directory: 'api' },
          },
          {
              label: 'Specification',
              items: [
                  { label: 'Protocol Specification', slug: 'specification/protocol' },
              ],
          },
			],
  }), react()],

  vite: {
    plugins: [tailwindcss()],
  },
});