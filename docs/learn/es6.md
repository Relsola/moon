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

## 字符串的扩展

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

## 解构赋值

解构是一种打破数据结构，将其拆分为更小部分的过程。

### 对象解构

```js
const person = {
	name: 'Relsola',
	age: 24
};
const { name, age } = person;
console.log(name); // Relsola
console.log(age); // 24
```

### 解构赋值

```js
const person = {
	name: 'Relsola',
	age: 24
};
let name, age;

({ name, age } = person);
console.log(name); // Relsola
console.log(age); // 24
```

### 解构默认值

使用解构赋值表达式时，如果指定的局部变量名称在对象中不存在，那么这个局部变量会被赋值为 `undefined`，此时可以随意指定一个默认值。

```js
const person = {
	name: 'Relsola',
	age: 24
};
const { name, age, sex = '男' } = person;
console.log(sex); // 男
```

### 为非同名变量赋值

```js
const person = {
	name: 'Relsola',
	age: 24
};
const { name, age } = person; // 相当于 let { name: name, age: age } = person;

const { name: newName, age: newAge } = person;
console.log(newName); // Relsola
console.log(newAge); // 24
```

### 嵌套对象结构

解构嵌套对象任然与对象字面量语法相似，只是我们可以将对象拆解成我们想要的样子。

```js
const person = {
  name: 'Relsola',
  age: 24
  job: {
    name: 'FE',
    salary: 1000
  },
  department: {
    group: {
      number: 1000,
      isMain: true
    }
  }
};
let {
  job,
  department: { group }
} = person;
console.log(job); // { name: 'FE', salary: 1000 }
console.log(group); // { number: 1000, isMain: true }
```

### 数组解构

```js
const colors = ['red', 'green', 'blue'];
const [firstColor, secondColor] = colors;
// 按需解构
const [, , threeColor] = colors;
console.log(firstColor); // red
console.log(secondColor); // green
console.log(threeColor); // blue
```

> 解构数组赋值

```js
const colors = ['red', 'green', 'blue'];
let firstColor, secondColor;
[firstColor, secondColor] = colors;
console.log(firstColor); // red
console.log(secondColor); // green
```

> 数组解构设置默认值

```js
const colors = ['red'];
const [firstColor, secondColor = 'green'] = colors;
console.log(firstColor); // red
console.log(secondColor); // green
```

> 嵌套数组解构

```js
const colors = ['red', ['green', 'lightgreen'], 'blue'];
const [firstColor, [secondColor]] = colors;
console.log(firstColor); // red
console.log(secondColor); // green
```

> 不定元素

```js
let colors = ['red', 'green', 'blue'];
let [firstColor, ...restColors] = colors;
console.log(firstColor); // red
console.log(restColors); // ['green', 'blue']
```

### 解构参数

当我们定一个需要接受大量参数的函数时，通常我们会创建可以可选的对象，将额外的参数定义为这个对象的属性

```js
function setCookie(name, value, options) {
	options = options || {};
	let path = options.path,
		domain = options.domain,
		expires = options.expires;
	// ...
}

// 使用解构参数
function setCookie(name, value, { path, domain, expires } = {}) {
	// ...
}
```

## 对象的扩展

### 属性和方法简写

`ES6` 允许在大括号里面，直接写入变量和函数，作为对象的属性和方法。这样的书写更加简洁。

```js
const birth = '2000/01/01';

const Person = {
	name: 'Relsola',

	//等同于birth: birth
	birth,

	// 等同于hello: function ()...
	hello() {
		console.log(this.name);
	}
};
```

### 属性名表达式

`ES6` 允许表达式作为对象的属性名，即把表达式放在方括号内。

```js
const propKey = 'foo';

const obj = {
	[propKey]: true,
	['a' + 'bc']: 123
};
```

### super 关键字

`super` 关键字指向当前对象的原型对象。

```js
const proto = {
	foo: 'hello'
};

const obj = {
	foo: 'world',
	find() {
		return super.foo;
	}
};
```

::: warning 注意
只有对象的方法中才有 `super` 关键字，且是以简写形式定义的方法。
:::

### 对象的扩展运算符 ...

对象的扩展运算符 `...` 会把对象转为用逗号分隔的键值对序列。

常用于对象的解构赋值，对象合并、对象克隆等。

```js
const foo = { ...['a', 'b', 'c'] };
foo; // {0: "a", 1: "b", 2: "c"}

const { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };
x; // 1
y; // 2
z; // { a: 3, b: 4 }
```

::: warning 注意
扩展运算符的参数对象之中，如果有取值函数 `get`，这个函数是会执行的。
:::

### Object 函数新增的方法

- `Object.is()` : 用于比较两个数据是否相等，返回布尔值； 类似于全等，不同点 `NaN` 和 `NaN` 相等、`+0` 和 `-0` 不相等。
- `Object.assign()` : 合并对象。
- `Object.getOwnPropertyDescriptor()` :   获取某个自身属性的描述信息。
- `Object.getOwnPropertyDescriptors()` : 获取对象所有自身属性的描述信息(`ES8` 新增)。
- `Object.getPrototypeOf()` : 获取对象的原型。
- `Object.setPrototypeOf()` :     给对象设置原型。
- `Object.keys()` : 返回数组，由对象的属性名组成。
- `Object.values()` : 返回数组，由对象的属性值组成(`ES8` 新增)。
- `Object.entries()` : 返回二维数组，由属性名和属性值 组成(`ES8` 新增)。
- `Object.getOwnPropertyNames()` :   返回数组，有对象的属性名组成。
- `Object.formEntries()` : `Object.entries()`的逆运算 (`ES8` 新增)。

## 函数的扩展

### 形参默认值

```js
function fun(key, timeout = 2000, callback = () => {}) {
	// ...
}
```

::: tip
对于默认参数而言，除非不传或者主动传递 `undefined` 才会使用参数默认值  
如果传递 `null`，这是一个合法的参数，不会使用默认值。
:::

#### 形参默认值对 `arguments` 对象的影响

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

#### 默认参数的暂时性死区

在 `let` 和 `const` 变量声明之前尝试访问该变量会触发错误，在函数默认参数中也存在暂时性死区

```js
function add(first = second, second) {
	return first + second;
}
add(1, 1); // 2

// first 参数使用参数默认值，而此时 second 变量还没有初始化
add(undefined, 1); // 抛出错误
```

### 不定参数

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

#### 不定参数的限制

- 一个函数最多只能有一个不定参数。
- 不定参数一定要放在所有参数的最后一个。
- 不能在对象字面量 `setter` 之中使用不定参数。

#### 展开运算符 `...`

展开运算符和不定参数是最为相似的，不定参数可以让我们指定多个各自独立的参数，并通过整合后的数组来访问；而展开运算符可以让你指定一个数组，将它们打散后作为各自独立的参数传入函数。

```js
const arr = [4, 10, 5, 6, 32];
// ES6 之前
console.log(Math.max.apply(Math, arr)); // 32
// 使用展开运算符
console.log(Math.max(...arr)); // 32
```

### 函数对象新增属性

- `name`: 返回函数名（声明函数时的名字）
