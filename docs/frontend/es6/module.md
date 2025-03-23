# 模块化

`模块` 是自动运行在严格模式下并且没有办法退出运行的 `JavaScript` 代码，与共享一切架构相反，它有如下几个特点：

- 在模块顶部创建的变量不会自动被添加到全局共享作用域，而是仅在模块的顶级作用域中存在。
- 模块必须导出一些外部代码可以访问的元素，例如变量或者函数。
- 模块也可以从其他模块导入绑定。
- 在模块的顶部，`this` 的值是 `undefined`。

## `export` 导出

`export` 关键字将一部分已发布的代码暴露给其他模块。

```js
export const PI = 3.1415;

export function sum(num1, num2) {
	return num1 + num2;
}

export { KEY } from './key.js';
export { add as ADD } from './key.js';
export * from './key.js';

export default {
	PI,
	sum
};
```

::: warning 注意

1. 未暴露的变量和方法是私有的，外部无法访问。
2. 通过 `default` 关键字设置一个默认的导出值，导出时多次使用`default`关键字会报错。
3. 导入默认值和导入非默认值是可以混用的。
4. 可以重新导出一个导入值

:::

## `import` 导入

`import` 关键字在另一个模块中导入暴露的代码。

```js
import { PI } from './example.js';

import * as Example from './example.js';

import RG, { sum } from './example.js';
```

::: warning 注意

1. 当从模块中导入一个绑定时，它就好像使用了 `const` 定义的一样。结果是我们不能定义另一个同名的变量，也无法在 `import` 语句前使用标识符或改变绑定的值。
2. 可以导入整个模块作为一个单一的对象，然后所有的导出都可以作为对象的属性使用。
3. 不管在 `import` 语句中把一个模块写多少次，该模块始终只执行一次，因为导入模块执行后，实例化过的模块被保存在内存中，只要另一个 `import` 语句引用它就可以重复使用。
4. `export` 和 `import` 语句必须在其他语句和函数之外使用，在其中使用会报错。

:::

## 无绑定导入

无绑定导入最有可能被应用于创建 `polyfill` 和 `shim`。

模块中的顶层管理、函数和类不会自动出现在全局作用域中，但这并不意味这模块无法访问全局作用域。

```js
Array.prototype.pushAll = function (items) {
	if (!Array.isArray(items)) {
		throw new TypeError('参数必须是一个数组。');
	}
	return this.push(...items);
};
```

无绑定导入`array.js`：

```js
import './array.js';
let colors = ['red', 'green', 'blue'];
let items = [];
items.pushAll(colors);
```

## 加载模块

在`Web`浏览器中使用一个脚本文件，可以通过如下三种方式来实现：

- 在 `script` 元素中通过 `src` 属性指定一个加载代码的地址来加载 `js` 脚本。
- 将 `js` 代码内嵌到没有 `src` 属性的 `script` 元素中。
- 通过 `Web Worker` 或者 `Service Worker` 的方式加载并执行 `js` 代码。

为了完全支持模块的功能，`JavaScript`扩展了`script`元素的功能，使其能够通过设置`type/module`的形式来加载模块：

```js
// 外联一个模块文件
<script type="module" src="./math.js"></script>

// 内联模块代码
<script type="module">
  import { sum } from './example.js'
  sum(1, 2)
</script>
```

### Web 浏览器中模块加载顺序

模块和脚本不同，它是独一无二的，可以通过 `import` 关键字来指明其所依赖的其他文件，并且这些文件必须加载进该模块才能正确执行，因此为了支持该功能，`<script type="module"></script>` 执行时自动应用 `defer` 属性。

```js
// 最先执行
<script type="module" src="./math.js"></script>
// 其次执行
<script type="module">
  import { sum } from './math.js'
</script>
// 最后执行
<script type="module" src="./math1.js"></script>
```

### Web 浏览器中的异步模块加载

`async` 属性也可以应用在模块上，在 `<script type="module"></script>` 元素上应用 `async` 属性会让模块以类似于脚本的方式执行，唯一的区别在于：在模块执行前，模块中的所有导入资源必须全部下载下来。

```js
// 无法保证哪个模块先执行
<script type="module" src="./module1.js" async></script>
<script type="module" src="./module2.js" async></script>
```

### 将模块作为 Worker 加载

为了支持加载模块，`HTML` 标准的开发者向 `Worker` 这些构造函数添加了第二个参数，第二个参数是一个对象，其 `type` 属性的默认值是 `script`，可以将 `type` 设置为 `module` 来加载模块文件。

```js
let worker = new Worker('math.js', { type: 'module' });
```

### 浏览器模块说明符解析

浏览器要求模块说明符具有以下几种格式之一：

- 以`/`开头的解析为根目录开始。
- 以`./`开头的解析为当前目录开始。
- 以`../`开头的解析为父目录开始。
- `URL`格式。

```js
import { first } from '/example1.js';
import { second } from './example2.js';
import { three } from '../example3.js';
import { four } from 'https://www.baidu.com/example4.js';
```

下面这些看起来正常的模块说明符在浏览器中实际上是无效的：

```js
import { first } from 'example1.js';
import { second } from 'example/example2.js';
```
