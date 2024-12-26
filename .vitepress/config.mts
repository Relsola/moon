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
  base: '/moon/',
  head: [['link', { rel: 'icon', href: '/moon/favicon.jpg' }]],

  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'JavaScript', link: '/JavaScript/' },
      { text: 'Java', link: '/Java/' },
      { text: 'SQl', link: '/SQL/' },
      { text: 'Godot', link: '/Godot/' },
      { text: 'C++', link: '/CPP/' },
      { text: 'C#', link: '/CSharp/' },
      {
        text: 'GitHub',
        items: [{ text: 'sudoku', link: 'https://github.com/Relsola/sudoku' }]
      }
    ],

    sidebar: {
      '/JavaScript/': [
        { text: 'JavaScript 知识笔记', link: '/JavaScript/' },
        { text: '最佳实践', link: '/JavaScript/best-practice' },
        { text: 'ES6+', link: '/JavaScript/es6' },
        { text: '正则表达式', link: '/JavaScript/regexp' },
        { text: 'TypeScript', link: '/JavaScript/typescript' }
      ],
      '/Java/': [
        { text: 'Java 知识笔记', link: '/Java/' },
        { text: 'Spring Boot 开发', link: '/Java/spring' }
      ]
    },

    outline: {
      level: 2,
      label: '页面导航'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Relsola' },
      {
        icon: 'steam',
        link: 'https://steamcommunity.com/profiles/76561198871195039/'
      }
    ]
  },

  vite: {
    plugins: [
      UnoCSS(),
      AutoImport({ resolvers: [ElementPlusResolver()] }),
      Components({ resolvers: [ElementPlusResolver()] })
    ],

    resolve: {
      alias: [{ find: '@components', replacement: path('components') }]
    },

    ssr: {
      noExternal: [/element-plus/]
    }
  }
});
