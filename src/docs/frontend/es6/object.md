# 对象的扩展

## 属性和方法简写

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

## 属性名表达式

`ES6` 允许表达式作为对象的属性名，即把表达式放在方括号内。

```js
const propKey = 'foo';

const obj = {
	[propKey]: true,
	['a' + 'bc']: 123
};
```

## super 关键字

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

## 对象的扩展运算符 ...

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

## Object 函数新增的方法

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
