import { defineConfig } from 'vitepress';
import { resolve } from 'path';

// Element Plus 自动导入和按需加载
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

// 集成 unocss
import UnoCSS from 'unocss/vite';

import sidebar from './sidebar';
import nav from './nav';

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
		nav,
		sidebar,

		outline: {
			level: 2,
			label: '目录'
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
				{ find: '@demo', replacement: path('demo') }
			]
		},

		ssr: {
			noExternal: [/element-plus/]
		}
	}
});
