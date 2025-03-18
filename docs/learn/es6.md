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

### String 对象新增方法

- `trim()`: 去除两边的空格。
- `startsWith()`: 断当前字符串是否以另外一个字符串开头，返回布尔值。
- `endsWith()`: 断当前字符串是否以另外一个字符串结尾，返回布尔值。
- `includes()`: 确定是否可以在一个字符串中找到另一个字符串，返回布尔值。
- `repeat()`: 复制字符串。
- `padStart()`: 从当前字符串的开头开始用另一个字符串填充当前字符串，直到达到给定的长度（`ES8` 新增）。
- `padEnd()`: 从当前字符串的结尾开始用另一个字符串填充当前字符串，直到达到给定的长度（`ES8` 新增）。
- `matchAll()`: 返回迭代器，是所有匹配到的结果(`ES10` 新增)。
- `trimStart()`: 从字符串的开头移除空白字符，并返回一个新的字符串(`ES10` 新增)。
- `trimEnd()`: 从字符串的结尾移除空白字符，并返回一个新的字符串(`ES10` 新增)。

## 数值的扩展

### 二进制和八进制表示法

`ES6` 提供了二进制和八进制数值的新的写法，分别用前缀 `0b`（或 `0B`）和 `0o`（或 `0O`）表示。

```js
0b101; // 二进制 5

0o101; // 八进制 65

0x101; // 十六进制 257
```

::: warning 注意
从 `ES5` 开始，在严格模式之中八进制就不再允许使用前缀 `0` 表示，`ES6` 进一步明确要使用前缀 `0o` 表示。
:::

如果要将 `0b` 和 `0o` 前缀的字符串数值转为十进制，使用 `Number` 方法即可。

```js
Number('0b101'); // 5
Number('0o101'); // 65
```

### 数值分隔符

较长的数值允许每三位添加一个分隔符（通常是一个逗号），增加数值的可读性。比如，`1000` 可以写作 `1,000`。

`ES2021`，允许 `JavaScript` 的数值使用下划线（`_`）作为分隔符。

```js
// 小数
0.000_001;

// 科学计数法
1e10_000;
```

::: warning 数值分隔符使用注意点

- 不能放在数值的最前面（`leading`）或最后面（`trailing`）。
- 不能两个或两个以上的分隔符连在一起。
- 小数点的前后不能有分隔符。
- 科学计数法里面，表示指数的 `e` 或 `E` 前后不能有分隔符。

:::

### Number 对象新增方法

- `isFinite()`: 检查一个数值是否为有限的。
- `isNaN()`: 检查一个值是否为 `NaN`。
- `isInteger()`: 判断一个数值是否为整数。
- `isSafeInteger()`: 判断一个整数是否在精确范围之内。
- `EPSILON`: 常量属性，表示 1 与大于 1 的最小浮点数之间的差。
- `MAX_SAFE_INTEGER`: 常量属性，表示精确数值表示的上限。
- `MIN_SAFE_INTEGER`: 常量属性，表示精确数值表示的下限。

::: tip
`ES6` 在 `Math` 对象上新增了许多与数学相关的方法。所有这些方法都是静态方法，只能在 `Math` 对象上调用。

`ES7` 新增指数运算符 `**` 用于计算次方。

```js
2 ** 4; // 计算2的4次方
2 ** (2 ** 3); // 运算顺序，先算右边的
```

:::

### BigInt 数据类型

`ES2020` 引入了一种新的数据类型 `BigInt`（大整数），这是 `ECMAScript` 的第八种数据类型。

`BigInt` 只用来表示整数，没有位数的限制，任何位数的整数都可以精确表示。

```js
const a = 2172141653n;
const b = 15346349309n;

// BigInt 可以保持精度
a * b; // 33334444555566667777n

// 普通整数无法保持精度
Number(a) * Number(b); // 33334444555566670000
```

为了与 `Number` 类型区别，`BigInt` 类型的数据必须添加后缀 `n`。

```js
1234; // 普通整数
1234n; // BigInt

// BigInt 的运算
1n + 2n; // 3n
```

`BigInt` 同样可以使用各种进制表示，都要加上后缀 `n`。

```js
0b1101n; // 二进制
0o777n; // 八进制
0x16n; // 十六进制
```

::: warning 注意
`BigInt` 与普通整数是两种值，它们之间并不相等。

```js
42n === 42; // false
```

`BigInt` 可以使用负号（`-`），但是不能使用正号（`+`），因为会与 `asm.js` 冲突。

```js
-42n + // 正确
	42n; // 报错
```

:::

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

## 数组的扩展

### 扩展运算符

扩展运算符（`spread`）是三个点（`...`）。它好比 `rest` 参数的逆运算，将一个数组转为用逗号分隔的参数序列。

```js
function push(array, ...items) {
	array.push(...items);
}

function add(x, y) {
	return x + y;
}

const numbers = [4, 38];
add(...numbers); // 42
```

扩展运算符后面还可以放置表达式。

```js
const arr = [...(x > 0 ? ['a'] : []), 'b'];
```

替代函数的 `apply()` 方法

```js
// ES5 的写法
Math.max.apply(null, [14, 3, 77]);

// ES6 的写法
Math.max(...[14, 3, 77]);

// 等同于
Math.max(14, 3, 77);
```

扩展运算符还可以将字符串转为真正的数组。

```js
[...'hello']; // [ "h", "e", "l", "l", "o" ]
```

### Array.from 和 Array.of

#### Array.from

`Array.from()` 方法用于将两类对象转为真正的数组：类似数组的对象（`array-like object`）和可遍历（`iterable`）的对象（包括 `ES6` 新增的数据结构 `Set` 和 `Map`）。

```js
// NodeList 对象
let nodes = document.querySelectorAll('p');
Array.from(nodes).filter(p => {
	return p.textContent.length > 100;
});

// arguments 对象
function foo() {
	const args = Array.from(arguments);
	// ...
}
```

`Array.from()` 可以将各种值转为真正的数组，并且还提供 `map` 功能。

```js
Array.from({ length: 3 }); // [ undefined, undefined, undefined ]

Array.from([1, , 2, , 3], n => n || 0); // [1, 0, 2, 0, 3]
```

`Array.from()` 的另一个应用是，将字符串转为数组，然后返回字符串的长度。  
因为它能正确处理各种 `Unicode` 字符，可以避免 `JavaScript` 将大于 `\uFFFF` 的 `Unicode` 字符，算作两个字符的 `bug`。

```js
function countSymbols(string) {
	return Array.from(string).length;
}
```

#### Array.of

`Array.of()` 方法用于将一组值，转换为数组。

这个方法的主要目的是弥补数组构造函数 `Array()` 会因为参数个数的不同导致行为有差异。

```js
Array(); // []
Array(3); // [, , ,]
Array(3, 11, 8); // [3, 11, 8]

Array.of(); // []
Array.of(undefined); // [undefined]
Array.of(1); // [1]
Array.of(1, 2); // [1, 2]
```

### Array 对象新增方法

- `copyWithin()` : 将指定位置的成员复制到其他位置（会覆盖原有成员），然后返回当前数组。
- `find()` : 参数是回调函数，返回第一个满足条件的元素。
- `findIndex()` : 参数是回调函数，返回第一个满足条件的元素的索引。
- `findLast()` : 参数是回调函数，从数组结尾开始，返回第一个满足条件的元素。
- `findLastIndex()` : 参数是回调函数，从数组结尾开始，返回第一个满足条件的元素的索引。
- `fill()` : 填充数组。
- `includes()` : 判断数组中是否包含某个元素，返回布尔值（`ES7` 新增）。
- `flat()` : 把数组拉平（多维数组变为一维数组），参数默认是 `1`（只拉平 `1` 层）， 可设置 `Infinity`，不论维位数组 （`ES10` 新增）。
- `flat()` : 把数组拉平（多维数组变为一维数组），参数默认是 `1`（只拉平 `1` 层）， 可设置 `Infinity`，不论维位数组 （`ES10` 新增）。
- `at()` : 接受一个整数作为参数，返回对应位置的成员，并支持负索引。也可用于字符串和类型数组（`TypedArray`）。

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

## 迭代器和生成器

### 迭代器

迭代器是一种特殊的对象，它具有一些专门为迭代过程设计的专有接口，所有迭代器都有一个叫 `next` 的方法，每次调用都返回一个结果对象。  
结果对象有两个属性，一个是 `value` 表示下一次将要返回的值；另外一个是 `done` ，它是一个布尔类型的值，当没有更多可返回的数据时返回 `true`。  
迭代器还会保存一个内部指针，用来指向当前集合中值的位置，每调用一次 `next` 方法，都会返回下一个可用的值。

`ES6` 引入迭代器的宗旨就是消除普通循环中的复杂性并减少循环中的错误。

创建一个迭代器：

```js
function createIterator(items) {
	let i = 0;
	return {
		next: function () {
			const done = i >= items.length;
			const value = done ? undefined : items[i++];
			return { done: done, value: value };
		}
	};
}

const iterator = createIterator([1, 2, 3]);
console.log(iterator.next()); // { value: 1, done: false }
console.log(iterator.next()); // { value: 2, done: false }
console.log(iterator.next()); // { value: 3, done: false }
console.log(iterator.next()); // { value: undefined, done: true }
```

### 生成器

生成器是一种返回迭代器的函数，通过 `function` 关键字后的 `*` 号来表示，函数中会用到新的关键词 `yield`。

```js
function* createIterator() {
	yield 1;
	yield 2;
	yield 3;
}
const iterator = createIterator();
console.log(iterator.next()); // { value: 1, done: false }
console.log(iterator.next()); // { value: 2, done: false }
console.log(iterator.next()); // { value: 3, done: false }
console.log(iterator.next()); // { value: undefined, done: true }
```

**生成器函数最重要的一点是：每执行完一条 `yield` 语句，函数就会自动终止**

一般函数一旦开始执行，除非遇到错误否则一直会向下执行直到 `return` 语句，生成器函数则是当执行完一条 `yield` 语句时，函数会自动停止执行，除非代码手动调用迭代器的 `next` 方法。

在循环中使用生成器

```js
function* createIterator(items) {
	for (let i = 0, len = items.length; i < len; i++) {
		yield items[i];
	}
}
const it = createIterator([1, 2, 3]);
console.log(it.next()); // { done: false, value: 1 }
console.log(it.next()); // { done: false, value: 2 }
console.log(it.next()); // { done: false, value: 3 }
console.log(it.next()); // { done: true, value: undefined }
```

::: warning 限制
`yield` 关键字只能在生成器内部使用，在其他地方使用会导致抛出错误，即使是在生成器内部的函数中使用也是如此。
:::

```js
function * createIterator (items) {
   // 抛出错误
  items.forEach(item => yield item + 1)
}
```

### 可迭代对象和 `for-of` 循环

可迭代对象具有 `Symbol.iterator` 属性，是一种与迭代器密切相关的对象。  
`Symbol.iterator` 通过指定的函数可以返回一个作用于附属对象的迭代器。  
在 `ES6` 中，所有的集合对象(`Array` 、`Set` 、 `Map` )和字符串都是可迭代对象，这些对象中都有默认的迭代器。  
由于生成器默认会为 `Symbol.iterator` 属性赋值，因此所有通过生成器创建的迭代器都是可迭代对象。

`ES6` 新引入了 `for-of` 循环每执行一次都会调用可迭代对象的 `next` 方法，并将迭代器返回的结果对象的 `value` 属性存储在一个变量中，循环将持续执行这一过程直到返回对象的 `done` 属性的值为 `true`。

```js
const value = [1, 2, 3];
for (const num of value) {
	console.log(num);
}
// 1
// 2
// 3
```

#### 访问默认的迭代器

可以通过 `Symbol.iterator` 来访问对象的默认迭代器

```js
const values = [1, 2, 3];
const it = values[Symbol.iterator]();
console.log(it.next()); // {done:false, value:1}
console.log(it.next()); // {done:false, value:2}
console.log(it.next()); // {done:false, value:3}
console.log(it.next()); // {done:true, value:undefined}
```

由于具有 `Symbol.iterator` 属性的对象都有默认的迭代器对象，因此可以用它来检测对象是否为可迭代对象：

```js
function isIterator(object) {
	return typeof object[Symbol.iterator] === 'function';
}

console.log(isIterator([1, 2, 3])); // true
console.log(isIterator('hello')); // true
console.log(isIterator(new Set())); // true
console.log(isIterator(new Map())); // true
```

#### 创建可迭代对象

默认情况下，我们自己定义的对象都是不可迭代对象，但如果给 `Symbol.iterator` 属性添加一个生成器，则可以将其变为可迭代对象。

```js
const collection = {
	items: [1, 2, 3],
	*[Symbol.iterator]() {
		for (const item of this.items) {
			yield item;
		}
	}
};
for (const value of collection) {
	console.log(value);
}
// 1
// 2
// 3
```

### 内建迭代器

在`ES6`中有三种类型的集合对象：`Array` 数组、`Set` 集合、`Map` 集合，它们都内建了如下三种迭代器：

- `entries`：返回一个迭代器，其值为多个键值对。
- `values`：返回一个迭代器，其值为集合的值。
- `keys`：返回一个迭代器，其值为集合中的所有键名。

#### `entries()` 迭代器：

```js
const colors = ['red', 'green', 'blue'];
const set = new Set([1, 2, 3]);
const map = new Map([
	['name', 'AAA'],
	['age', 23],
	['address', '广东']
]);

for (let item of colors.entries()) {
	console.log(item);
	// [0, 'red']
	// [1, 'green']
	// [2, 'blue']
}
for (let item of set.entries()) {
	console.log(item);
	// [1, 1]
	// [2, 2]
	// [3, 3]
}
for (let item of map.entries()) {
	console.log(item);
	// ['name', 'AAA']
	// ['age', 23]
	// ['address', '广东']
}
```

#### `values` 迭代器：

```js
const colors = ['red', 'green', 'blue'];
const set = new Set([1, 2, 3]);
const map = new Map([
	['name', 'AAA'],
	['age', 23],
	['address', '广东']
]);

for (let item of colors.values()) {
	console.log(item);
	// red
	// green
	// blue
}
for (let item of set.values()) {
	console.log(item);
	// 1
	// 2
	// 3
}
for (let item of map.values()) {
	console.log(item);
	// AAA
	// 23
	// 广东
}
```

#### `keys` 迭代器：

```js
const colors = ['red', 'green', 'blue'];
const set = new Set([1, 2, 3]);
const map = new Map([
	['name', 'AAA'],
	['age', 23],
	['address', '广东']
]);

for (let item of colors.keys()) {
	console.log(item);
	// 0
	// 1
	// 2
}
for (let item of set.keys()) {
	console.log(item);
	// 1
	// 2
	// 3
}
for (let item of map.keys()) {
	console.log(item);
	// name
	// age
	// address
}
```

#### 不同集合类型的默认迭代器

每一个集合类型都有一个默认的迭代器，在 `for-of` 循环中，如果没有显示的指定则使用默认的迭代器

- `Array` 和 `Set` 集合默认迭代器为`values`。
- `Map` 集合默认为`entries`。

```js
const colors = ['red', 'green', 'blue'];
const set = new Set([1, 2, 3]);
const map = new Map([
	['name', 'AAA'],
	['age', 23],
	['address', '广东']
]);
for (let item of colors) {
	console.log(item);
	// red
	// green
	// blue
}
for (let item of set) {
	console.log(item);
	// 1
	// 2
	// 3
}
for (let item of map) {
	console.log(item);
	// ['name', 'AAA']
	// ['age', 23]
	// ['address', '广东']
}
```

#### 解构和 `for-of` 循环

如果在 `for-of` 循环中使用解构语法，则可以简化编码过程。

```js
const map = new Map([
	['name', 'AAA'],
	['age', 23],
	['address', '广东']
]);
for (let [key, value] of map.entries()) {
	console.log(key, value);
	// name AAA
	// age 23
	// address 广东
}
```

#### 字符串迭代器

```js
const message = 'Hello';
for (let i = 0, len = message.length; i < len; i++) {
	console.log(message[i]);
	// H
	// e
	// l
	// l
	// o
}
```

#### `NodeList` 迭代器

`DOM` 标准中有一个 `NodeList` 类型，代表页面文档中所有元素的集合。`ES6` 为其添加了默认的迭代器，其行为和数组的默认迭代器一致。

```js
const divs = document.getElementByTagNames('div');
for (const div of divs) {
	console.log(div);
}
```

### 展开运算符和非数组可迭代对象

使用 `...` 展开运算符的过程中，操作 `Set` 集合的默认可迭代对象 `values`，从迭代器中读取所有值，然后按照返回顺序将他们依次插入到数组中。

```js
const set = new Set([1, 2, 3, 4]);
const array = [...set];
console.log(array); // [1, 2, 3, 4]
```

使用 `...` 展开运算符的过程中，操作 `Map` 集合的默认可迭代对象 `entries`，从迭代器中读取多组键值对，依次插入数组中。

```js
const map = new Map([
	['name', 'AAA'],
	['age', 23],
	['address', '广东']
]);
const array = [...map];
console.log(array); // [['name', 'AAA'], ['age', 23], ['address', '广东']]
```

使用 `...` 展开运算符的过程中，操作 `Array` 集合的默认可迭代对象 `values`，从迭代器中读取所有值，然后按照返回顺序依次将他们插入到数组中。

```js
const arr1 = ['red', 'green', 'blue'];
const arr2 = ['yellow', 'white', 'black'];
const array = [...arr1, ...arr2];
console.log(array); // ['red', 'green', 'blue', 'yellow', 'white', 'black']
```

### 高级迭代器功能

#### 给迭代器传递参数

如果给迭代器 `next()` 方法传递参数，则这个参数的值就会替代生成器内部上一条 `yield` 语句的返回值。

```js
function* createIterator() {
	const first = yield 1;
	const second = yield first + 2;
	yield second + 3;
}
const it = createIterator();
console.log(it.next(11)); // {done: false, value: 1}
console.log(it.next(4)); // {done: false, value: 6}
console.log(it.next(5)); // {done: false, value: 8}
console.log(it.next()); // {done: true, value: undefined}
```

#### 在迭代器中抛出错误

除了给迭代器传递数据外，还可以给他传递错误条件，让其恢复执行时抛出一个错误。

```js
function* createIterator() {
	const first = yield 1;
	const second = yield first + 2;
	// 不会被执行
	yield second + 3;
}
const it = createIterator();
console.log(it.next()); // {done: false, value: 1}
console.log(it.next(4)); // {done: false, value: 6}
console.log(it.throw(new Error('break'))); // 抛出错误
```

可以使用`try-catch`语句来捕获这种错误。

```js
function* createIterator() {
	let first = yield 1;
	let second;
	try {
		second = yield first + 2;
	} catch (error) {
		second = 6;
	}
	yield second + 3;
}
let it = createIterator();
console.log(it.next()); // {done: false, value: 1}
console.log(it.next(4)); // {done: false, value: 6}
console.log(it.throw(new Error('break'))); // {done: false, value: 9}
console.log(it.next()); // {done: true, value: undefined}
```

#### 生成器返回语句

由于生成器也是函数，因此可以通过 `return` 语句提前退出函数执行，对于最后一次 `next()` 方法调用，可以主动为其指定一个返回值。  
`return` 语句表示所有的操作都已经完成，`done` 会被设置成 `true` ，如果同时提供了响应的值，则 `value` 会被设置为这个值。

```js
function* createIterator() {
	yield 1;
	return 2;
	// 不会被执行
	yield 3;
	yield 4;
}
let it = createIterator();
console.log(it.next()); // {done: false, value: 1}
console.log(it.next()); // {done: true, value: 2}
console.log(it.next()); // {done: true, value: undefined}
```

::: warning 注意
展开运算符和 `for-of` 循环会直接忽略通过 `return` 语句指定的任何返回值，因为只要 `done` 被设置为 `true` ，就立即停止读取其他的值。
:::

```js
const obj = {
	items: [1, 2, 3, 4, 5],
	*[Symbol.iterator]() {
		for (let i = 0, len = this.items.length; i < len; i++) {
			if (i === 3) {
				return 300;
			} else {
				yield this.items[i];
			}
		}
	}
};
for (let value of obj) {
	console.log(value);
	// 1
	// 2
	// 3
}
console.log([...obj]); // [1, 2, 3]
```

#### 委托生成器

将两个迭代器合二为一，这样就可以创建一个生成器，再给 `yield` 语句添加一个星号，以达到将生成数据的过程委托给其他迭代器。

```js
function* createColorIterator() {
	yield ['red', 'green', 'blue'];
}
function* createNumberIterator() {
	yield [1, 2, 3, 4];
}
function* createCombineIterator() {
	yield* createColorIterator();
	yield* createNumberIterator();
}
let it = createCombineIterator();
console.log(it.next().value); // ['red', 'green', 'blue']
console.log(it.next().value); // [1, 2, 3, 4]
console.log(it.next().value); // undefined
```

## Class 语法

## Symbol

## 参考资料

- [ES6 标准入门（第 3 版）](https://es6.ruanyifeng.com/)
- [深入理解 ES6](https://wangtunan.github.io/blog/books/javascript/es6.html)
