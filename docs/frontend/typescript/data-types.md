# 数据类型

## 八种基本类型

```ts
const str: string = 'str';
const num: number = 24;
const bool: boolean = true;
const u: undefined = undefined;
const n: null = null;
const obj: object = { num: 1 };
const big: bigint = 100n;
const sym: symbol = Symbol('symbol');
```

::: tip
默认情况下 `null` 和 `undefined` 是所有类型的子类型  
就是可以把 `null` 和 `undefined` 赋值给其他类型

如果你在 `tsconfig.json` 指定了 `"strictNullChecks":true`  
`null` 和 `undefined` 只能赋值给 `void` 和它们各自的类型
:::

## Array 数组

对数组类型的定义有两种方式

```ts
const arr: string[] = ['1', '2'];

const arr: Array<number> = [1, 2];
```

## Function 函数

TS 的函数声明

```ts
function sum(x: number, y: number): number {
	return x + y;
}

type sum = (ix: number, y: number) => number;
```

用接口定义函数类型  
用函数表达式接口定义函数的方式时，对等号左侧进行类型限制  
可以保证以后对函数名赋值时保证参数个数、参数类型、返回值类型不变

```ts
interface SearchFunc {
	(source: string, subString: string): boolean;
}

const search: SearchFunc = (a, b) => a === b;
```

可选参数和参数默认值

```ts
const reduce = (x: number = 0, y?: number): number => {
	if (y === undefined) {
		return x;
	}
	return y - x;
};
```

剩余参数

```ts
const push = (arr: any[], ...items: any[]): void => {
	items.forEach(item => arr.push(item));
};
```

函数重载

```ts
function add(x: number, y: number): number;
function add(x: number, y: string): string;
function add(x: string, y: number): string;
function add(x: string, y: string): string;
function add(x: number | string, y: number | string) {
	if (typeof x === 'string' || typeof y === 'string') {
		return x.toString() + y.toString();
	}
	return x + y;
}
```

## Tuple 元组

元组最重要的特性是可以限制数组元素的个数和类型，它特别适合用来实现多值返回。

```ts
let x: [string, number];
```

可选元素

```ts
type Tuple = [number, string?];
const one: Tuple = [123, '123'];
const two: Tuple = [123];
```

元组类型的剩余元素

```ts
type ResTuple = [number, ...string[]];
const rt1: ResTuple = [666, '99', '88'];
```

::: warning 注意
元祖用于保存定长定数据类型的数据，表示一个已知元素数量和类型的数组，长度已指定，越界访问会提示错误。如果一个数组中可能有多种类型，数量和类型都不确定，那就直接 `any[]`
:::

## void 空类型

`void` 表示没有任何类型，和其他类型是平等关系，不能直接赋值，一般也只有在函数没有返回值时去声明。

```ts
const fun = (): void => {
	// ...
};
```

::: tip
方法没有返回值将得到 `undefined`，但是我们需要定义成 `void` 类型，而不是 `undefined` 类型。
:::

## never 不存在类型

`never` 类型表示的是那些永不存在的值的类型，值会永不存在的两种情况：

1. 如果一个函数执行时抛出了异常，那么这个函数永远不存在返回值，因为抛出异常会直接中断程序运行，这使得程序运行不到返回值那一步，即具有不可达的终点，也就永不存在返回了。
2. 函数中执行无限循环的代码（死循环），使得程序永远无法运行到函数返回值那一步，永不存在返回。

```ts
const err = (msg: string): never => {
	throw new Error(msg);
};

const lop = (): never => {
	while (true) {}
};
```

`never` 类型是任何类型的子类型，可以赋值给任何类型，但是没有类型是 `never` 的子类型或可以赋值给 `never` 类型（除了 `never` 本身之外），即使 `any` 也不可以赋值给 `never`。

使用 `never` 避免出现新增了联合类型没有对应的实现，目的就是写出类型绝对安全的代码，在 `TypeScript` 中，可以利用 `never` 类型的特性来实现全面性检查。

```ts
type Foo = string | number;

function controlFlowAnalysisWithNever(foo: Foo) {
	if (typeof foo === 'string') {
		// 这里 foo 被收窄为 string 类型
	} else if (typeof foo === 'number') {
		// 这里 foo 被收窄为 number 类型
	} else {
		// foo 在这里是 never
		const check: never = foo;
	}
}
```

## any 任意类型

在 `TypeScript` 中，任何类型都可以被归为 `any` 类型，这让 `any` 类型成为了类型系统的顶级类型。

在 `any` 上访问任何属性都是允许的,也允许调用任何方法。

```ts
let a: any = 'seven';
a = 7;

let c; // any
c = [7];
if (c.name === undefined) {
	// ...
}
```

## unknown 未知类型

`unknown` 与 `any` 一样，所有类型都可以分配给 `unknown`。

`unknown` 与 `any` 的最大区别是：

1. 任何类型的值可以赋值给 `any`，同时 `any` 类型的值也可以赋值给任何类型。
2. `unknown` 任何类型的值都可以赋值给它，但它只能赋值给 `unknown` 和 `any`。

```ts
let notSure: unknown = 4;
notSure = 'maybe a string instead'; // OK
notSure = false; // OK

let ms: unknown = 4;
let msg: any = ms;
let mss: unknown = ms;

let num: number = ms; // Error
```

如果不缩小类型，就无法对 `unknown` 类型执行任何操作，这种机制起到了很强的预防性，更安全，我们可以使用 `typeof`、类型断言等方式来缩小未知范围。

```ts
const getDog = (): string => 'dog';
const dog: unknown = { hello: getDog };
dog.hello(); // Error

const getCat = () => {
	let x: unknown;
	return x;
};

const cat = getCat();
// 直接使用
const upName = cat.toLowerCase(); // Error

// typeof
if (typeof cat === 'string') {
	const upName = cat.toLowerCase();
}

// 类型断言
const upName = (cat as string).toLowerCase(); // OK
```

## 对象类型

`Number`、`String`、`Boolean`、`Symbol`，从类型兼容性上看，原始类型兼容对应的对象类型，反过来对象类型不兼容对应的原始类型。

```ts
let num: number = 1;
let Num: Number = 1;

Num = num; // OK

num = Num; // Error
```

`Object` 代表所有拥有 `toString`、`hasOwnProperty` 方法的类型，所以所有原始类型、非原始类型都可以赋给 `Object`，同样，在严格模式下，`null` 和 `undefined` 类型也不能赋给 `Object`。

```ts
let obj: Object;

obj = 1; // OK
obj = true; // OK
obj = {}; // OK

obj = undefined; // Error
obj = null; // Error
```

`Object` 不仅是 `object` 的父类型，同时也是 `object` 的子类型。

::: warning 注意
管官方文档说可以使用 `object` 代替大 `Object`，但是我们仍要明白 `Object` 并不完全等价于 `object`。
:::

```ts
type A = object extends Object ? true : false; // true
type B = Object extends object ? true : false; // true

let objM: Object = {};
let objX: object = {};

objM = objX; // OK
objX = objM; // OK
```

`{}` 空对象类型和 `Object` 一样，也是表示原始类型和非原始类型的集合，在严格模式下，`null` 和 `undefined` 也不能赋给 `{}`。

```ts
let ObjectLiteral: {};

ObjectLiteral = 1; // ok
ObjectLiteral = 'a'; // ok
ObjectLiteral = true; // ok

ObjectLiteral = null; // Error
ObjectLiteral = undefined; // Error

ObjectLiteral = {}; // ok
```

::: tip 综述
`{}` 和 `Object` 是比 `object` 更宽泛的类型（least specific），`{}` 和 `Object` 可以互相代替，用来表示原始类型（`null`、`undefined` 除外）和非原始类型，小 `object` 则表示非原始类型。
:::
