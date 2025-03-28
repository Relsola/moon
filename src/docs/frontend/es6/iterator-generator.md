# 迭代器和生成器

## 迭代器

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

## 生成器

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

## 可迭代对象和 `for-of` 循环

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

### 访问默认的迭代器

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

### 创建可迭代对象

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

## 内建迭代器

在`ES6`中有三种类型的集合对象：`Array` 数组、`Set` 集合、`Map` 集合，它们都内建了如下三种迭代器：

- `entries`：返回一个迭代器，其值为多个键值对。
- `values`：返回一个迭代器，其值为集合的值。
- `keys`：返回一个迭代器，其值为集合中的所有键名。

### `entries()` 迭代器：

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

### `values` 迭代器：

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

### `keys` 迭代器：

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

### 不同集合类型的默认迭代器

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

### 解构和 `for-of` 循环

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

### 字符串迭代器

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

### `NodeList` 迭代器

`DOM` 标准中有一个 `NodeList` 类型，代表页面文档中所有元素的集合。`ES6` 为其添加了默认的迭代器，其行为和数组的默认迭代器一致。

```js
const divs = document.getElementByTagNames('div');
for (const div of divs) {
	console.log(div);
}
```

## 展开运算符和非数组可迭代对象

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

## 高级迭代器功能

### 给迭代器传递参数

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

### 在迭代器中抛出错误

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

### 生成器返回语句

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

### 委托生成器

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
