import { defineConfig } from 'vitepress'

const title = 'SineVFX'
const description = 'The VFX-focused properties editor and runtime for Roblox Studio.'
const site = 'https://sinevfx.xyz/docs'

export default defineConfig({
  title,
  description,
  lang: 'en-US',
  base: '/docs/',
  appearance: 'force-dark',
  cleanUrls: true,
  lastUpdated: true,

  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/docs/sine.png' }],
    ['meta', { name: 'theme-color', content: '#6fbffc' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:site_name', content: title }],
    ['meta', { name: 'og:title', content: title }],
    ['meta', { name: 'og:description', content: description }],
    ['meta', { name: 'og:image', content: `${site}/banner.png` }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Cantora+One&family=Nunito:wght@400;500;600;700;800&display=swap',
    }],
  ],

  themeConfig: {
    logo: '/sine.png',

    search: {
      provider: 'local',
    },

    // Single link back to the main site, sitting by the Discord icon.
    nav: [
      { text: 'sinevfx.xyz', link: 'https://sinevfx.xyz' },
    ],

    sidebar: {
      '/': [
        {
          text: 'Getting started',
          items: [
            { text: 'Introduction', link: '/' },
            { text: 'Installation', link: '/installation' },
            { text: 'Quick start', link: '/quick-start' },
            { text: 'Core concepts', link: '/concepts' },
            { text: 'Keybinds', link: '/keybinds' },
          ],
        },
        {
          text: 'Objects & effects',
          items: [
            { text: 'Overview', link: '/transformable' },
            { text: 'Transform', link: '/transform' },
            { text: '3D particle', link: '/part' },
            { text: 'Trail', link: '/trail' },
            { text: 'Beam', link: '/beam' },
            { text: 'Camera', link: '/camera' },
            { text: 'Emittable objects', link: '/emittable' },
          ],
        },
        {
          text: 'Editing',
          items: [
            { text: 'Properties', link: '/properties' },
            { text: 'Graph editor', link: '/graph-editor' },
            { text: 'Emit & preview', link: '/emit' },
            { text: 'Paths', link: '/paths' },
            { text: 'Asset Library', link: '/library' },
          ],
        },
        {
          text: 'Tools',
          items: [
            { text: 'Overview', link: '/overview' },
            { text: 'Shifter', link: '/shifter' },
            { text: 'Resizer', link: '/resizer' },
            { text: 'Retimer', link: '/retimer' },
            { text: 'Copier', link: '/copier' },
            { text: 'Color', link: '/color' },
            { text: 'Code', link: '/code' },
          ],
        },
        {
          text: 'Tutorials',
          items: [
            { text: 'Overview', link: '/tutorials' },
            { text: 'Your first effect', link: '/first-effect' },
          ],
        },
        {
          text: 'Shipping to your game',
          items: [
            { text: 'The runtime module', link: '/module' },
            { text: 'Runtime API', link: '/api' },
          ],
        },
        {
          text: 'Reference',
          items: [
            { text: 'Settings & themes', link: '/settings' },
            { text: 'FAQ & troubleshooting', link: '/faq' },
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
