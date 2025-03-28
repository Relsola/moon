# 块级作用域绑定

## `var` 声明和变量提升机制

在函数作用域或全局作用域中通过关键字 `var` 声明的变量，无论实际上是在哪里声明的，都会被当成在当前作用域顶部声明的变量，这就是变量提升。  
除了 `var` 变量会提升以外，`function` 函数声明也存在 hoisting 机制。

```js
getValue(false); // 输出 undefined

function getValue(condition) {
	if (condition) {
		var value = 'value';
		return value;
	} else {
		// 这里可以访问到 value，只不过值为 undefined
		console.log(value);
		return null;
	}
}
```

```js
console.log(fn); // undefined
if (true) {
	fn(); // fn...
	function fn() {
		console.log('fn...');
	}
}
console.log(fn); // Function
```

::: warning 注意
提升以函数为界限，提升不可能提升到函数外面。
:::

## 块级声明

块级声明用于声明在指定的作用域之外无妨访问的变量，块级作用域存在于函数内部和块中。

`let` 声明：

- `let` 声明和 `var` 声明的用法基本相同。
- `let` 声明的变量不会被提升。
- `let` 不能在同一个作用域中重复声明已经存在的变量，会报错。
- `let` 声明的变量作用域范围仅存在于当前的块中，程序进入块开始时被创建，程序退出块时被销毁。
- 全局作用域下使用 `let` 声明的变量不再挂载到 `window` 对象上。

`const` 声明：

- `const` 声明和 `let` 声明大多数情况是相同的。
- `const` 声明的量不能修改（栈空间）。
- `const` 声明的量必须赋值初始化。

## 暂时性死区

因为 `let` 和 `const` 声明的变量不会进行声明提升，所以在 `let` 和 `const` 变量声明之前任何访问此变量的操作都会引发错误

```js
if (condition) {
	// Error
	console.log(typeof value);
	let value = 'value';
}
```

## 块作用域绑定

在全局作用域下通过 `var` 声明一个变量，那么这个变量会挂载到全局对象 `window` 上。

```js
var num = 7;
console.log(window.num); // 7
```

使用 `let` 或者 `const` 在全局作用域下创建一个新的变量，这个变量不会添加到 `window` 上。

```js
let num = 7;
console.log(window.num); // undefined
```

> 最佳实践  
> 默认使用 `const`声明，只有确定变量的值会在后续需要修改时才会使用 `let` 声明  
> 因为大部分变量在初始化后不应再改变，而预料以外的变量值改变是很多 bug 的源头
