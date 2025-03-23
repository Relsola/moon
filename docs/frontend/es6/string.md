# 字符串的扩展

## 模板字符串

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

## 字符串的遍历器接口

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

## String 对象新增方法

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
