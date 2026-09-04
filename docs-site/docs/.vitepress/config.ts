import { defineConfig } from 'vitepress'

const title = 'SineVFX'
const description = 'The VFX-focused properties editor and runtime for Roblox Studio.'
const site = 'https://sinevfx.xyz/docs'

export default defineConfig({
  title,
  description,
  lang: 'en-US',
  base: '/docs/',
  appearance: 'dark',
  cleanUrls: true,
  lastUpdated: true,

  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/docs/favicon.png' }],
    ['meta', { name: 'theme-color', content: '#6fbffc' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:site_name', content: title }],
    ['meta', { name: 'og:title', content: title }],
    ['meta', { name: 'og:description', content: description }],
    ['meta', { name: 'og:image', content: `${site}/banner.png` }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    // Cantora One for display headings, Nunito for body — matches sinevfx.xyz
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Cantora+One&family=Nunito:wght@400;500;600;700;800&display=swap',
    }],
  ],

  themeConfig: {
    logo: '/logo.png',

    search: {
      provider: 'local',
    },

    nav: [
      { text: 'Guide', link: '/guide/introduction' },
      { text: 'Windows', link: '/windows/overview' },
      { text: 'Tools', link: '/tools/overview' },
      { text: 'Shipping', link: '/shipping/module' },
      { text: 'sinevfx.xyz', link: 'https://sinevfx.xyz' },
    ],

    sidebar: {
      '/': [
        {
          text: 'Getting started',
          items: [
            { text: 'Introduction', link: '/guide/introduction' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Quick start', link: '/guide/quick-start' },
            { text: 'Core concepts', link: '/guide/concepts' },
          ],
        },
        {
          text: 'The interface',
          items: [
            { text: 'The Hub', link: '/windows/overview' },
            { text: 'Transform', link: '/windows/transform' },
            { text: 'Properties', link: '/windows/properties' },
            { text: 'Graph editor', link: '/windows/graph-editor' },
            { text: 'Emit', link: '/windows/emit' },
            { text: 'Texture Library', link: '/windows/library' },
            { text: 'Paths', link: '/windows/paths' },
          ],
        },
        {
          text: 'Tools',
          items: [
            { text: 'Overview', link: '/tools/overview' },
            { text: 'Color', link: '/tools/color' },
          ],
        },
        {
          text: 'Effects',
          items: [
            { text: 'Presets', link: '/effects/presets' },
            { text: 'Camera Effect', link: '/effects/camera' },
          ],
        },
        {
          text: 'Shipping to your game',
          items: [
            { text: 'The runtime module', link: '/shipping/module' },
            { text: 'Runtime API', link: '/shipping/api' },
          ],
        },
        {
          text: 'Reference',
          items: [
            { text: 'Settings & themes', link: '/reference/settings' },
            { text: 'FAQ & troubleshooting', link: '/reference/faq' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'discord', link: 'https://discord.gg/krQE8tGsUz' },
    ],

    footer: {
      message: 'Built by RoPotat0 for the Roblox VFX community.',
      copyright: 'SineVFX',
    },

    outline: { level: [2, 3] },
    docFooter: { prev: 'Previous', next: 'Next' },
  },
})
