# 函数的扩展

## 形参默认值

```js
function fun(key, timeout = 2000, callback = () => {}) {
	// ...
}
```

::: tip
对于默认参数而言，除非不传或者主动传递 `undefined` 才会使用参数默认值  
如果传递 `null`，这是一个合法的参数，不会使用默认值。
:::

### 形参默认值对 `arguments` 对象的影响

- 在 ES5 非严格模式下，如果修改参数的值，这些参数的值会同步反应到 `arguments` 对象中
- 而在 ES5 严格模式下，修改参数的值不再反应到 `arguments` 对象中
- 对于使用了 ES6 的形参默认值，`arguments` 对象的行为始终保持和 ES5 严格模式一样，无论当前是否为严格模式
- 即 `arguments` 总是等于最初传递的值，不会随着参数的改变而改变，总是可以使用 `arguments` 对象将参数还原为最初的值

```js
function mixArgs(first, second = 'B') {
	// arguments对象始终等于传递的值，形参默认值不会反映在arguments上
	console.log(arguments.length); // 1
	console.log(arguments[0]); // A
	console.log(arguments[1]); // undefined

	first = 'a';
	second = 'b';

	console.log(arguments[0]); // A
	console.log(arguments[1]); // undefined
}
mixArgs('A');
```

### 默认参数的暂时性死区

在 `let` 和 `const` 变量声明之前尝试访问该变量会触发错误，在函数默认参数中也存在暂时性死区

```js
function add(first = second, second) {
	return first + second;
}
add(1, 1); // 2

// first 参数使用参数默认值，而此时 second 变量还没有初始化
add(undefined, 1); // 抛出错误
```

## 不定参数

JavaScript 的函数语法规定无论函数已定义的命名参数有多少个，都不限制调用时传入的实际参数的数量。

```js
function pick(object, ...keys) {
	let result = Object.create(null);
	for (let i = 0, len = keys.length; i < len; i++) {
		let item = keys[i];
		result[item] = object[item];
	}
	return result;
}
```

### 不定参数的限制

- 一个函数最多只能有一个不定参数。
- 不定参数一定要放在所有参数的最后一个。
- 不能在对象字面量 `setter` 之中使用不定参数。

### 展开运算符 `...`

展开运算符和不定参数是最为相似的，不定参数可以让我们指定多个各自独立的参数，并通过整合后的数组来访问；而展开运算符可以让你指定一个数组，将它们打散后作为各自独立的参数传入函数。

```js
const arr = [4, 10, 5, 6, 32];
// ES6 之前
console.log(Math.max.apply(Math, arr)); // 32
// 使用展开运算符
console.log(Math.max(...arr)); // 32
```

## 函数对象新增属性

- `name`: 返回函数名（声明函数时的名字）

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
