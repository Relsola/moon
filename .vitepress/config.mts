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
			{ text: 'Archives', link: '/archives/summer-pockets' },
			{ text: 'Learn', link: '/learn/es6' },
			{ text: 'Link', link: '/link/' },
			{
				text: 'GitHub',
				items: [
					{ text: 'cmd-games', link: 'https://github.com/Relsola/sudoku' },
					{ text: 'osu!', link: 'https://github.com/ppy/osu' }
				]
			}
		],

		sidebar: {
			'archives/': [
				{
					text: '2024',
					collapsed: false,
					items: [{ text: 'Summer Pockets', link: '/archives/summer-pockets' }]
				}
			],
			'learn/': [
				{
					text: 'C++',
					collapsed: false,
					items: []
				},
				{
					text: 'C#',
					collapsed: false,
					items: [{ text: 'C# 开发', link: '/learn/csharp' }]
				},
				{
					text: 'JavaScript',
					collapsed: false,
					items: [
						{ text: 'ES6+', link: '/learn/es6' },
						{ text: 'TypeScript', link: '/learn/typescript' },
						{ text: 'Vue3 源码分析', link: '/learn/vue3-source-code' }
					]
				},
				{
					text: 'Java',
					collapsed: false,
					items: [{ text: 'Java 开发', link: '/learn/java' }]
				},
				{
					text: '计算机基础',
					collapsed: false,
					items: [{ text: '数据结构与算法', link: '/learn/algorithm' }]
				},
				{
					text: 'SQL',
					collapsed: false,
					items: [{ text: 'SQL 语言', link: '/learn/sql' }]
				}
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
			AutoImport({
				dts: path('types/auto-imports.d.ts'),
				imports: ['vue'],
				resolvers: [ElementPlusResolver()]
			}),
			Components({
				resolvers: [ElementPlusResolver()],
				dts: path('types/components.d.ts')
			})
		],

		resolve: {
			alias: [
				{ find: '@', replacement: path('') },
				{ find: '@assets', replacement: path('assets') }
			]
		},

		ssr: {
			noExternal: [/element-plus/]
		}
	}
});
