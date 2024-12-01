# JavaScript 工具函数片段

## 添加和删除事件监听器

使用 EventTarget.addEventListener() 向元素添加事件监听器
使用事件委托将单个事件监听器添加到 父元素，避免为单个元素添加事件监听造成性能浪费
opts.target 指定将事件绑定在哪个子元素中，值是一个 css 选择器字符串
opts.options 为 addEventListener 第三个参数配置项
注意添加事件的返回值，用于 EventTarget.removeEventListener( ) 解除事件监听的绑定

::: code-group

```js [JS]
/**
 * @type {import('vitepress').UserConfig}
 */
const config = {
	// ...
};

export default config;
```

```ts [TS]
import type { UserConfig } from 'vitepress';

const config: UserConfig = {
	// ...
};

export default config;
```

:::

```ts
/**
- @description 添加事件监听器
- @param {HTMLElement} el 事件监听器对象
- @param {string} event 事件名称
- @param {Function} fn 事件执行回调
- @param {{target:string | undefined, options?: boolean | AddEventListenerOptions | undefined} | undefined} opts 配置项 target 指向委托的子元素 一个 CSS 选择器，options 监听器配置项
- @return {Function} 用于解绑的回调函数
 */

function on(el, event, fn, opts = {}) {
	const delegatorFn = e =>
		e.target.matches(opts.target) && fn.call(e.target, e);
	el.addEventListener(
		event,
		opts.target ? delegatorFn : fn,
		opts.options || false
	);
	return opts.target ? delegatorFn : fn;
}

const fn = e => console.log(e);

on(document.body, 'click', fn);

on(document.body, 'click', fn, { target: 'p' });

on(document.body, 'click', fn, { options: true });

on(document.body, 'click', fn, { target: 'p', options: { once: true } });
```
