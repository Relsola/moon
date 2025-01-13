import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import jquery from 'jquery';
import { resolve } from 'path';

/** 当前执行 node 命令时文件夹的地址（工作目录） */
const root: string = process.cwd();

/** 路径拼接函数，简化代码 */
const pathResolve = (path: string): string => resolve(root, path);

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],

  define: {
    $: jquery,
    jQuery: jquery,
    'windows.jQuery': jquery
  },

  resolve: {
    alias: [{ find: '@', replacement: pathResolve('src') }],
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.json', '.vue'] // 添加 .vue 扩展名
  },

  server: {
    hmr: {
      overlay: false
    }
  }
});
