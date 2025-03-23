# 数组的扩展

## 扩展运算符

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

## Array.from 和 Array.of

### Array.from

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

### Array.of

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

## Array 对象新增方法

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
