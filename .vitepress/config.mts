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
      { text: 'Web 前端', link: '/JavaScript/' },
      { text: 'Java 后端', link: '/Java/' },
      { text: '数据库', link: '/SQL/' },
      { text: '计算机', link: '/Other/git' },
      { text: 'Tools', link: '/Tools/link' },
      { text: 'Game', link: '/Game/cpp' },
      {
        text: 'GitHub',
        items: [
          { text: 'cmd-games', link: 'https://github.com/Relsola/sudoku' },
          { text: 'osu!', link: 'https://github.com/ppy/osu' },
          { text: 'pure-admin-web', link: 'https://github.com/' },
          { text: 'pure-admin-server', link: 'https://github.com/' }
        ]
      }
    ],

    sidebar: {
      '/JavaScript/': [
        { text: 'JavaScript 知识笔记', link: '/JavaScript/' },
        { text: 'ES6+', link: '/JavaScript/es6' },
        { text: '前端最佳实践', link: '/JavaScript/best-practice' },
        { text: 'TypeScript', link: '/JavaScript/typescript' },
        { text: 'TS 类型挑战', link: '/JavaScript/type-challenges' },
        { text: 'Vue2 源码学习', link: '/JavaScript/vue-source-code' },
        { text: 'Vue3 源码学习', link: '/JavaScript/vue-source-code' },
        { text: 'ElementPlus 源码学习', link: '/JavaScript/vue-source-code' },
        { text: 'Vite 源码学习', link: '/JavaScript/vue-source-code' }
      ],
      '/Java/': [
        { text: 'Java 知识笔记', link: '/Java/' },
        { text: 'Java 进阶', link: '/Java/advanced' },
        { text: 'Spring 开发', link: '/Java/spring' },
        { text: 'Spring Boot 源码学习', link: '/Java/spring' },
        { text: 'JDK1.8 源码学习', link: '/Java/spring' }
      ],
      '/SQL/': [
        { text: 'SQL 语言', link: '/SQL/' },
        { text: 'MySQL', link: '/SQL/mysql' },
        { text: 'Redis', link: '/SQL/redis' }
      ],
      '/Other/': [
        { text: 'Git 指南', link: '/Other/git' },
        { text: 'Linux', link: '/Other/linux' },
        { text: 'Shell 脚本', link: '/Other/linux' },
        { text: 'Docker 容器', link: '/Other/linux' },
        { text: '数据结构与算法', link: '/Other/algorithm' },
        { text: '操作系统', link: '/Other/system' },
        { text: '编译原理', link: '/Other/compilation' }
      ],
      '/Tools/': [
        { text: '链接导航', link: '/Tools/link' },
        { text: '正则测试器', link: '/Tools/regexp' },
        { text: '图片取色器', link: '/Tools/color' },
        { text: 'Movie', link: '/Tools/movie' }
      ],
      '/Game/': [
        { text: 'C++ 知识笔记', link: '/Game/cpp' },
        { text: 'C# 知识笔记', link: '/Game/csharp' },
        { text: 'Godot 知识笔记', link: '/Game/godot' }
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
