import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';

import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import ElementPlus from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';

import 'virtual:uno.css';
// import './style/custom.css';

export default {
	extends: DefaultTheme,

	enhanceApp({ app }) {
		app.use(ElementPlus, { locale: zhCn });
		for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
			app.component(key, component);
		}
	}
} satisfies Theme;
