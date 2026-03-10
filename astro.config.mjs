// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [starlight({
			title: 'toq protocol',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/toqprotocol' }],
			sidebar: [
          {
              label: 'Getting Started',
              items: [
                  { label: 'Overview', slug: 'getting-started/overview' },
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