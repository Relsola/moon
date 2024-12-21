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
      {
        text: 'Web',
        items: [
          { text: 'JavaScript', link: '/web/JavaScript/' },
          { text: 'Java', link: '/web/Java/' },
          { text: '数据库', link: '/web/SQl/' },
          { text: 'TypeScript', link: '/web/TypeScript/' }
        ]
      },
      {
        text: 'Game',
        items: [
          { text: 'C++', link: '/game/CPP/' },
          { text: 'C#', link: '/game/CSharp/' },
          { text: 'Godot', link: '/game/Godot/' }
        ]
      },
      {
        text: 'Learn',
        items: [
          { text: 'Python', link: '/learn/Python/' },
          { text: 'C 语言', link: '/learn/C/' },
          { text: 'Rust', link: '/learn/Rust/' }
        ]
      },
      { text: 'GitHub', link: 'GitHub/index' }
    ],

    sidebar: {
      '/web/JavaScript/': [
        { text: 'JavaScript', link: '/web/JavaScript/' },
        { text: 'ES6+', link: '/web/JavaScript/es6' },
        { text: '正则表达式', link: 'web/JavaScript/regexp' }
      ],
      'web/Java/': [
        { text: 'Java 知识笔记', link: '/web/Java/' },
        { text: 'Spring Boot 开发', link: '/web/Java/spring' }
      ]
    },

    outline: {
      level: 2,
      label: '页面导航'
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/Relsola' }]
  }
});
