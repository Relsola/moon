# 编程风格

## 使用 const 和 let

## 使用 IIFE

在 JavaScript 中，我们可以使用自执行函数（Immediately-invoked Function Expression）IIFE 将代码放入一个函数中，来创建一个私有作用域，防止变量污染全局作用域和其他代码模块。

```js
(function () {
	// 这里是私有作用域
	// ...
})();
```

## 三元表达式简化 if-else

```js
let a;

if (n > 0) {
	a = n ** 2;
} else {
	a = -n + 1;
}

a = n > 0 ? n ** 2 : -n + 1;
```

::: warning 注意
三元嵌套三元不利于可读性，且不适合复杂表达式。
:::
