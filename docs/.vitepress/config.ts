import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Marzipan',
  description: 'Framework-agnostic markdown editor with a live overlay preview, zero runtime dependencies, and batteries-included formatting actions.',
  lang: 'en-US',

  outDir: '../docs-site',

  // Links to files outside the docs root (CHANGELOG, OVERVIEW, etc.) are valid
  // relative links for GitHub markdown but are not part of the VitePress site.
  ignoreDeadLinks: [
    /\/OVERVIEW/,
    /\/CHANGELOG/,
    /\/bakeshop-demo\//,
    /\.d\.ts$/,
  ],

  head: [
    ['link', { rel: 'icon', href: '/favicon.png' }],
  ],

  themeConfig: {
    logo: '/logo.png',
    siteTitle: 'Marzipan',

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Quick Start', link: '/quick-start' },
      { text: 'API', link: '/api' },
      { text: 'Plugins', link: '/plugins' },
      { text: '🛝 Playground', link: 'https://bakeshop.pinkpixel.dev' },
      {
        text: 'v1.1.0',
        items: [
          { text: 'Changelog', link: 'https://github.com/pinkpixel-dev/marzipan/blob/main/CHANGELOG.md' },
        ]
      }
    ],

    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Introduction', link: '/' },
          { text: 'Quick Start', link: '/quick-start' },
        ]
      },
      {
        text: 'Core Reference',
        items: [
          { text: 'API Reference', link: '/api' },
          { text: 'Type Definitions', link: '/types' },
        ]
      },
      {
        text: 'Plugins',
        items: [
          { text: 'Plugin Catalogue', link: '/plugins' },
        ]
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/pinkpixel-dev/marzipan' },
    ],

    footer: {
      message: 'Released under the Apache 2.0 License.',
      copyright: 'Copyright © Pink Pixel'
    },

    search: {
      provider: 'local'
    }
  }
})
