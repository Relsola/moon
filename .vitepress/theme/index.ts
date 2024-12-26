import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import 'virtual:uno.css';

export default {
  extends: DefaultTheme,

  enhanceApp({ app }) {
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component);
    }
  }
} satisfies Theme;
