# TS 类型

## 字面量类型

在 TypeScript 中，字面量不仅可以表示值，还可以表示类型  
目前，TypeScript 支持 3 种字面量类型

- 字符串字面量类型
- 数字字面量类型
- 布尔字面量类型

```ts
const s: 'this' = 'this';
const n: 789 = 789;
const t: true = true;
```

通过使用字面量类型组合的联合类型，我们可以限制函数的参数为指定的字面量类型集合，然后编译器会检查参数是否是指定的字面量类型集合里的成员。
相较于使用 `string` 类型，使用字面量类型（组合的联合类型）可以将函数的参数限定为更具体的类型，这不仅提升了程序的可读性， 还保证了函数的参数类型，可谓一举两得。

```ts
// 推荐
type d = 'up' | 'down';
const move = (dir: d): null => null;
move('up'); // OK
```

## `let` 和 `const` 分析

`const` 定义为一个不可变更的常量，在缺省类型注解的情况下，`TypeScript` 推断出它的类型直接由赋值字面量的类型决定。

```ts
const str = 'this is string'; // str : 'this is string'
const num = 1; // num : 1
const bool = true; // bool : true
```

缺省显式类型注解的可变更的变量的类型转换为了赋值字面量类型的父类型。

```ts
let str = 'this is string'; // string
let num = 2; // number
let bool = true; // boolean

str = 'any string';
num = 5;
bool = false;
```

## 类型拓宽 Type Widening

我们将 `TypeScript` 的字面量子类型转换为父类型的这种设计称之为 "literal widening"，也就是字面量类型的拓宽。

所有通过 `let` 或 `var` 定义的变量、函数的形参、对象的非只读属性，如果满足指定了初始值且未显式添加类型注解的条件，那么它们推断出来的类型就是指定的初始值字面量类型拓宽后的类型，这就是字面量类型拓宽。

```ts
let str = 'this is string'; // string
let strFun = (str = 'this is string') => str; // (str?: string) => string;
const specifiedStr = 'this is string'; // 'this is string'
let str2 = specifiedStr; // 'string'
let strFun2 = (str = specifiedStr) => str; // (str?: string) => string;
```

当一个 `const` 声明的字面量类型被赋值给一个 `let` 声明的变量时，`TypeScript` 会将变量的类型推断为更宽泛的类型。  
当一个明确的字面量类型被赋值给另一个变量时，即使这个变量是用 `let` 声明的，`TypeScript` 也会保留字面量类型。

```ts
const str: 'this is string' = 'this is string'; // 'this is string'
let str2 = str; // 'this is string'

interface Vector3 {
	x: number;
	y: number;
	z: number;
}
const getComponent = (vector: Vector3, axis: 'x' | 'y' | 'z') => vector[axis];

// 使用 getComponent 函数时，TypeScript 会提示以下错误信息：
// 类型“string”的参数不能赋给类型“"x" | "y" | "z"”的参数。
let x = 'x';
let vec = { x: 10, y: 20, z: 30 };
getComponent(vec, x); // Error

// 使用 const 可以帮助我们修复前面例子中的错误
const y = 'y'; // let x:"x" = "x" 显示注解也行
getComponent(vec, y); // 20
```

当你在一个值之后使用 const 断言时，`TypeScript` 将为它推断出最窄的类型，没有拓宽，对于真正的常量，这通常是你想要的。

```ts
// 提供显式类型注释
const obj: { x: 1 | 2 | 3 } = { x: 1 };

// const 断言
const obj1 = { x: 1, y: 2 }; // {x: number; y: number}
const obj2 = { x: 1 as const, y: 2 }; // {x: 1; y: number}
const obj3 = { x: 1, y: 2 } as const; //  {readonly x: 1; readonly y: 2}

const arr1 = [1, 2, 3]; // number[]
const arr2 = [1, 2, 3] as const; // readonly [1, 2, 3]
```

## 类型缩小 Type Narrowing

在 TypeScript 中，我们可以通过某些操作将变量的类型由一个较为宽泛的集合缩小到相对较小、较明确的集合，这就是 "Type Narrowing"。

```ts
// 类型守卫
const func = (anything: any) => {
	if (typeof anything === 'string') {
		return anything;
	} else if (typeof anything === 'number') {
		return anything;
	}
	return null;
};

// 同样，我们可以使用类型守卫将联合类型缩小到明确的子类型
const fun = (anything: string | number) => {
	if (typeof anything === 'string') {
		return anything;
	} else if (typeof anything === 'number') {
		return anything;
	}
};
```

通过字面量类型等值判断`（===）`或其他控制流语句（包括但不限于 if、三目运算符、switch 分支）将联合类型收敛为更具体的类型。

```ts
type Goods = 'pen' | 'pencil' | 'ruler';

const getConst = (item: Goods) => {
	if (item === 'pen') {
		item; // item => 'pen'
	} else {
		item; // => 'pencil' | 'ruler'
	}
};

interface UploadEvent {
	type: 'upload';
	filename: string;
	contents: string;
}

interface DownloadEvent {
	type: 'download';
	filename: string;
}

type AppEvent = UploadEvent | DownloadEvent;

function handleEvent(e: AppEvent) {
	switch (e.type) {
		case 'download':
			e; // Type is DownloadEvent
			break;
		case 'upload':
			e; // Type is UploadEvent
			break;
	}
}
```

## 联合类型

联合类型表示取值可以为多种类型中的一种，使用 `|` 分隔每个类型。  
联合类型通常与 `null` 或 `undefined` 一起使用。

```ts
let myFavoriteNumber: string | number;
myFavoriteNumber = 'seven'; // OK
myFavoriteNumber = 7; // OK

let num: 0 | 1 = 1;
type EventNames = 'click' | 'scroll' | 'mousemove';
```

## 类型别名

类型别名用来给一个类型起个新名字。类型别名常用于联合类型。

```ts
type Message = string | string[];
const greet = (message: Message) => {};
```

## 交叉类型

交叉类型是将多个类型合并为一个类型，这让我们可以把现有的多种类型叠加到一起成为一种类型，它包含了所需的所有类型的特性，使用&定义交叉类型。

如果我们仅仅把原始类型、字面量类型、函数类型等原子类型合并成交叉类型，是没有任何用处的，因为任何类型都不能满足同时属于多种原子类型，因此其类型就是个 `never`。

```ts
type useLess = string & number; // never
```

交叉类型真正的用武之地就是将多个接口类型合并成一个类型，从而实现等同接口继承的效果，也就是所谓的合并接口类型。

```ts
type t = { id: number; name: string } & { age: number };
const m1: t = { id: 1, name: '张三', age: 18 };
```

如果合并的多个接口类型存在同名属性:

- 如果同名属性的类型不兼容 `never`
- 如果同名属性的类型兼容 类型就是两者中的子类型
- 属性是非基本数据类型 可以成功合并

```ts
// 1. 同名属性的类型不兼容
type One = { id: number; name: 2 } & {
	age: number;
	name: number;
};
const obj: One = { id: 1, name: 'string', age: 2 }; //Error
// 'string' 类型不能赋给 'never' 类型

// 2. 同名属性的类型兼容
type Tow = { id: number; name: 2 } & {
	age: number;
	name: number;
};
// number & 2  --> 子类型 2
const obj: Tow = {
	id: 1,
	name: 2, // OK
	// name: 18, // Error
	age: 18
};

// 3. 属性是非基本数据类型
interface A {
	x: { d: true };
}
interface B {
	x: { e: string };
}
interface C {
	x: { f: number };
}
type ABC = A & B & C;

const abc: ABC = { x: { d: true, e: '', f: 666 } }; // OK
```
