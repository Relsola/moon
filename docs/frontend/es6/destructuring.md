# 解构赋值

解构是一种打破数据结构，将其拆分为更小部分的过程。

## 对象解构

```js
const person = {
	name: 'Relsola',
	age: 24
};
const { name, age } = person;
console.log(name); // Relsola
console.log(age); // 24
```

## 解构赋值

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

## 解构默认值

使用解构赋值表达式时，如果指定的局部变量名称在对象中不存在，那么这个局部变量会被赋值为 `undefined`，此时可以随意指定一个默认值。

```js
const person = {
	name: 'Relsola',
	age: 24
};
const { name, age, sex = '男' } = person;
console.log(sex); // 男
```

## 为非同名变量赋值

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

## 嵌套对象结构

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

## 数组解构

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

## 解构参数

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
