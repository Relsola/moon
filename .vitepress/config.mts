import { defineConfig } from 'vitepress';
import { resolve } from 'path';

// Element Plus 自动导入和按需加载
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

// 集成 unocss
import UnoCSS from 'unocss/vite';

// Vite 配置路径别名的
const root = process.cwd();
const path = (path: string) => resolve(root, path);

export default defineConfig({
  title: 'Relsola',
  description: "Relsola's blog.",
  srcDir: 'docs/',
  base: '.',
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
        { text: 'JavaScript 知识笔记', link: '/web/JavaScript/' },
        { text: '最佳实践', link: '/web/JavaScript/best-practice' },
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
  },

  vite: {
    plugins: [
      UnoCSS(),
      AutoImport({ resolvers: [ElementPlusResolver()] }),
      Components({ resolvers: [ElementPlusResolver()] })
    ],

    resolve: {
      alias: [{ find: '@components', replacement: path('components') }]
    }
  }
});
