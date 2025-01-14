import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import jquery from 'jquery';
import { resolve } from 'path';

// Vite 配置路径别名的
const root = process.cwd();
const path = (path: string) => resolve(root, path);

export default defineConfig({
  plugins: [vue()],

  define: {
    $: jquery,
    jQuery: jquery,
    'windows.jQuery': jquery
  },

  resolve: {
    alias: [
      { find: '@', replacement: path('src') },
      { find: '@components', replacement: path('src/components') }
    ],
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.json', '.vue'] // 添加 .vue 扩展名
  }
});
