import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Relsola',
  description: "Relsola's blog.",
  srcDir: 'docs/',

  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'JavaScript', link: 'JavaScript/javascript' },
      { text: 'Java', link: 'Java/note' },
      { text: 'C++', link: 'C++/note' },
      { text: 'Game', link: 'Game/cs' }
    ],

    sidebar: {
      '/JavaScript/': [
        { text: 'JavaScript', link: '/JavaScript/javascript' },
        { text: 'TypeScript', link: '/JavaScript/typescript' },
        { text: 'Vue', link: '/JavaScript/vue' },
        { text: 'React', link: '/JavaScript/react' },
        { text: 'Function', link: '/JavaScript/function' },
        { text: 'indexedDE 数据库', link: '/JavaScript/indexedDE' }
      ],
      '/Java/': [
        { text: 'Java', link: '/' },
        { text: 'Spring Boot', link: '/' },
        { text: 'SQL', link: '/' }
      ],
      '/C++/': [
        { text: 'C++', link: '/' },
        { text: 'STL', link: '/' },
        { text: 'OpenGL', link: '/' },
        { text: 'DirectX', link: '/' }
      ],
      '/Game/': [
        { text: 'Game', link: '/' },
        { text: 'Unity', link: '/' },
        { text: 'Unreal', link: '/' }
      ]
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/Relsola' }]
  }
});
