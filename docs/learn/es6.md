---
outline: [2, 3]
---

# ES6+

## 块级作用域

### var 声明和变量提升机制

在函数作用域或全局作用域中通过关键字 `var` 声明的变量，无论实际上是在哪里声明的，都会被当成在当前作用域顶部声明的变量，这就是变量提升。

除了 `var` 变量会提升以外，`function` 函数声明也存在变量提升机制。

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

### 块级声明

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

### 暂时性死区

因为 `let` 和 `const` 声明的变量不会进行声明提升，所以在 `let` 和 `const` 变量声明之前任何访问此变量的操作都会引发错误

```js
if (condition) {
	// Error
	console.log(typeof value);
	let value = 'value';
}
```

### 块作用域绑定

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
> 默认使用 `const`声明，只有确定变量的值会在后续需要修改时才会使用 `let` 声明。  
> 大部分变量在初始化后不应再改变，而预料以外的变量值改变是很多 bug 的源头。

## 箭头函数

箭头函数是一种使用箭头 `=>` 定义函数的新语法，提供简洁的语法和解决 `this` 绑定问题。

箭头函数使 `JavaScript` 编程更加方便和直观，消除了函数的二义性，尤其是在处理回调函数和高阶函数时。

### 箭头函数的语法

```js
// 无参数 无返回值
() => {};

// 无参数且只有一行表达式可省略 {}
() => 123;

// 返回值是一个对象
() => ({});

// 一个参数可省略 ()
val => val;

// 多个参数 多行表达式
(a, b, c) => {
	//...
};
```

### 箭头函数的 this 指向规则

1. 箭头函数没有 `prototype` (原型)，所以箭头函数本身没有 `this`，也不能通过 `new` 关键词进行调用，也就没有 `new.target` 属性。

```js
const a = () => {};
console.log(a.prototype); // undefined

let b = new a(); // Error
```

2. 箭头函数的 `this` 指向在定义的时候继承自外层第一个普通函数的 `this`。被继承的普通函数的 `this` 指向改变，箭头函数的 `this` 指向会跟着改变。

```js
let a;

function bar() {
	a = () => {
		console.log(this);
	};
}

bar();
a(); // Window

bar.call({ msg: 'this' });
a(); // { msg: 'this' }
```

3. 不能直接修改箭头函数的 `this` 指向，箭头函数外层没有普通函数，严格模式和非严格模式下它的 `this` 都会指向 `window` (全局对象)。

```js
const a = () => {
	console.log(this);
};

a(); // Window

a.call({ msg: 'this' });
a(); // Window
```

### 箭头函数与普通函数的差异

1. 箭头函数没有 `arguments` 绑定，它的 `arguments` 继承于 `this` 绑定的函数，如果 `this` 指向全局，则使用 `arguments` 会报未声明的错误。

```js
const b = () => {
	console.log(arguments);
};
b(1, 2, 3, 4); // Error

function bar() {
	const a = () => {
		console.log(arguments); // Arguments对象 [1, 2, 3]
	};

	a();
}
bar(1, 2, 3);

// 使用 es6 的 rest 语法获取剩余参数
const a = (first, ...abc) => {
	console.log(first, abc); // 1 数组 [2, 3, 4]
};
a(1, 2, 3, 4);
```

2. 箭头函数不支持重命名函数参数，普通函数的函数参数支持重命名。

```js
function fn1(a, a) {
	console.log(a, arguments); // 2 [1,2]
}

const fn2 = (a, a) => {
	console.log(a); // Error
};

fn1(1, 2);
fn2(1, 2);
```

## 字符串

### 模板字符串

模板字符串 `template string` 是增强版的字符串，用反引号 <code>`</code> 标识。

它可以当作普通字符串使用，也可以用来定义多行字符串，或者在字符串中嵌入变量和 `JavaScript` 表达式。

```js
// 普通字符串
`In JavaScript '\n' is a line-feed.`;

// 多行字符串
`In JavaScript this is
 not legal.`;

// 嵌入变量
const str = 'World';
`Hello ${str}`; // "Hello World"

// 嵌入 JavaScript 表达式
const x = 1;
const y = 2;
`${x} + ${y} = ${x + y}`; // "1 + 2 = 3"
```

### 字符串的遍历器接口

`ES6` 为字符串添加了遍历器接口（`Iterator`），使得字符串可以被 `for...of` 循环遍历。

```js
for (let codePoint of 'foo') {
	console.log(codePoint);
}
// "f"
// "o"
// "o"
```

除了遍历字符串，这个遍历器最大的优点是可以识别大于 `0xFFFF` 的码点，传统的 `for` 循环无法识别这样的码点。

```js
const text = String.fromCodePoint(0x20bb7);

for (let i = 0; i < text.length; i++) {
	console.log(text[i]);
}
// " "
// " "

for (let i of text) {
	console.log(i);
}
// "𠮷"
```
