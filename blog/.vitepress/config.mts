import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Relsola',
  description: "Relsola's blog.",
  srcDir: 'docs/',
  base: '/moon/',
  head: [['link', { rel: 'icon', href: '/moon/favicon.jpg' }]],

  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'JavaScript', link: 'JavaScript/javascript' },
      { text: 'Java', link: 'Java/java' },
      { text: 'C/C++', link: 'C++/note' },
      { text: 'Game', link: 'Game/cs' },
      { text: 'GitHub', link: 'GitHub/index' }
    ],

    sidebar: {
      '/JavaScript/': [
        { text: 'JavaScript', link: '/JavaScript/javascript' },
        { text: 'ES6+', link: '/JavaScript/es6' },
        { text: 'TypeScript', link: '/JavaScript/typescript' },
        { text: 'Vue', link: '/JavaScript/vue' },
        { text: 'React', link: '/JavaScript/react' },
        { text: 'JavaScript 工具函数', link: '/JavaScript/function' },
        { text: '位运算', link: '/JavaScript/bit' },
        { text: 'indexedDE 数据库', link: '/JavaScript/indexedDE' },
        { text: '手写系列', link: '/JavaScript/handwritten' },
        { text: '正则表达式', link: '/JavaScript/regexp' },
        { text: '设计模式', link: '/JavaScript/designPattern' }
      ],
      '/Java/': [
        { text: 'Java', link: '/Java/java' },
        { text: 'Spring Boot', link: '/' },
        { text: 'SQL', link: '/Java/sql' }
      ],
      '/C++/': [
        { text: 'C++ 学习笔记', link: '/' },
        { text: 'STL', link: '/' },
        { text: 'OpenGL', link: '/' },
        { text: 'DirectX', link: '/' },
        { text: 'C 学习笔记', link: '/' }
      ],
      '/Game/': [
        { text: 'Game', link: '/' },
        { text: 'Unity', link: '/' },
        { text: 'Unreal', link: '/' }
      ]
    },

    outline: {
      level: 'deep',
      label: '页面导航'
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/Relsola' }]
  }
});
