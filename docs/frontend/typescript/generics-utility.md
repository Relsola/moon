# 泛型工具

- [`Partial<T>` 将类型的属性变成可选](#partial)

- [`Required<T>` 将类型的属性变成必选](#required)

- [`Readonly<T>` 将某个类型所有属性变为只读](#readonly)

- [`Record<K, T>` 将 K 中所有的属性的值映射为 T 类型](#record)

- [`Parameters<T>` 用于获得函数的参数类型组成的元组类型](#parameters)

- [`ReturnType<T>` 得到一个函数的返回值类型](#returntype)

- [`ConstructorParameters<T>` 获取构造函数类型 T 的参数类型](#constructorparameters)

- [`InstanceType<T>` 获取构造函数类型 T 的实例类型](#instancetype)

- [`Pick<T, K>` 从某个类型中挑出一些属性出来](#pick)

- [`Exclude<T, U>` 将某个类型中属于另一个的类型移除掉](#exclude)

- [`Extract<T, U>` 从 T 中提取出 U](#extract)

- [`Omit<T, K>` 使用 T 类型中除了 K 类型的所有属性，来构造一个新的类型](#omit)

- [`NonNullable<T>` 过滤类型中的 null 及 undefined 类型](#nonnullable)

- [`Awaited<T>` 获取 Promise 的返回值类型](#awaited)

- [`NoInfer<T>` 防止 `TypeScript` 从泛型函数内部推断类型](#noinfer)

- [`Intrinsic String Manipulation Types` 字符串操作类型](#intrinsic-string-manipulation-types)

## Partial

`Partial<T>` 将类型的属性变成可选

```ts
// 定义
type Partial<T> = {
	[K in keyof T]?: T[K];
};

interface UserInfo {
	id: number;
	name: string;
}

const Relsola: Partial<UserInfo> = { name: 'Relsola' };
```

但是 `Partial<T>` 有个局限性，就是只支持处理第一层的属性

如果要处理多层，就可以自己实现

```ts
interface UserInfo {
	id: number;
	name: string;
	fruits: {
		appleNumber: number;
		orangeNumber: number;
	};
}

const Relsola: Partial<UserInfo> = { fruits: { orangeNumber: 1 } }; // Error

type DeepPartial<T> = {
	// 如果是 object，则递归类型
	[K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

const Relsola: DeepPartial<UserInfo> = {
	fruits: { orangeNumber: 1 }
};
```

## Required

`Required` 将类型的属性变成必选

```ts
// 定义
type Required<T> = {
	// -? 移除可选
	[K in keyof T]-?: T[K];
};

interface UserInfo {
	id?: number;
	name?: string;
}

const tom: Required<UserInfo> = { id: 1, name: 'tom' };
```

## Readonly

`Readonly<T> `的作用是将某个类型所有属性变为只读属性，不能被重新赋值。

```ts
// 定义
type Readonly<T> = {
	readonly [K in keyof T]: T[K];
};

interface Todo {
	title: string;
}

const todo: Readonly<Todo> = {
	title: 'Delete inactive users'
};

todo.title = 'Hello'; // Error
```

## Record

`Record<K extends keyof any, T> `的作用是将 `K` 中所有的属性的值映射为 `T` 类型。

```ts
// 定义
type Record<K extends keyof any, T> = {
	[P in K]: T;
};

type Info = Record<string, string | number>;
const tom: Info = {
	id: 1,
	name: 'tom',
	age: 17
};

interface PageInfo {
	title: string;
}
type Page = 'home' | 'about' | 'contact';

const x: Record<Page, PageInfo> = {
	about: { title: 'about' },
	contact: { title: 'contact' },
	home: { title: 'home' }
};
```

## Parameters

`Parameters<T>` 的作用是用于获得函数的参数类型组成的元组类型。

```ts
// 定义
type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;

type A = Parameters<() => void>; // []
type B = Parameters<typeof Array.isArray>; // [any]
type C = Parameters<typeof parseInt>; // [string, (number | undefined)?]
type D = Parameters<typeof Math.max>; // number[]
```

## ReturnType

`ReturnType<F>` 用来得到一个函数的返回值类型

```ts
// 定义
type ReturnType<T extends (...arg: any[]) => any> = T extends (...arg: any[]) => infer R
	? R
	: never;

type Func = (value: number) => string;

const foo: ReturnType<Func> = 'string';
```

## ConstructorParameters

`ConstructorParameters<T>` 获取构造函数类型 T 的参数类型

```ts
// 定义
type ConstructorParameters<T extends abstract new (...args: any) => any> = T extends abstract new (
	...args: infer P
) => any
	? P
	: never;

class Moon {
	abs: string;

	constructor(abs: string) {
		this.abs = abs;
	}
}

type MoonConstructor = ConstructorParameters<typeof Moon>; // [abs: string]
```

## InstanceType

`InstanceType<T>` 获取构造函数类型 T 的实例类型

```ts
// 定义
type InstanceType<T extends abstract new (...args: any) => any> = T extends abstract new (
	...args: any
) => infer R
	? R
	: any;

class Moon {
	abs: string;

	constructor(abs: string) {
		this.abs = abs;
	}
}

type MoonInstance = InstanceType<typeof Moon>; // Moon
```

## Pick

`Pick` 从某个类型中挑出一些属性出来

```ts
// 定义
type Pick<T, K extends keyof T> = {
	[P in K]: T[P];
};

interface Todo {
	title: string;
	description: string;
	completed: boolean;
}

type TodoPreview = Pick<Todo, 'title' | 'completed'>;

const todo: TodoPreview = {
	title: 'Clean room',
	completed: false
};
```

## Exclude

`Exclude<T, U>` 的作用是将某个类型中属于另一个的类型移除掉。

```ts
// 定义
type Exclude<T, U> = T extends U ? never : T;

// 如果 T 能赋值给 U 类型的话，那么就会返回 never 类型
// 否则返回 T 类型。最终实现的效果就是将 T 中某些属于 U 的类型移除掉。

type T0 = Exclude<'a' | 'b' | 'c', 'a'>; // "b" | "c"
type T1 = Exclude<'a' | 'b' | 'c', 'a' | 'b'>; // "c"
type T2 = Exclude<string | number | (() => void), Function>; // string | number
```

## Extract

`Extract<T, U>` 的作用是从 T 中提取出 U。

```ts
// 定义
type Extract<T, U> = T extends U ? T : never;

type T0 = Extract<'a' | 'b' | 'c', 'a' | 'f'>; // "a"
type T1 = Extract<string | number | (() => void), Function>; // () =>void
```

## Omit

`Omit<T, K extends keyof any> `使用 T 类型中除了 K 类型的所有属性，来构造一个新的类型。

```ts
// 定义
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

interface Todo {
	title: string;
	description: string;
	completed: boolean;
}

type TodoPreview = Omit<Todo, 'description'>;

const todo: TodoPreview = {
	title: 'Clean room',
	completed: false
};
```

## NonNullable

`NonNullable<T>` 的作用是用来过滤类型中的 null 及 undefined 类型。

```ts
// 定义
type NonNullable<T> = T extends null | undefined ? never : T;
// type NonNullable<T> = Exclude<T, undefined | null>

type T0 = NonNullable<string | number | undefined>; // string | number
type T1 = NonNullable<string[] | null | undefined>; // string[]
```

## Awaited

`Awaited<T>` 获取 `Promise` 的返回值类型：

- 该类型需要支持递归：它需要将嵌套的 `Promise` 的类型展开，直至得到 `Promise` 的最终返回值类型。
- 递归的结束条件是：对非 `PromiseLike` 的类型（没有 `then` 方法的对象类型）返回 `never`。

```ts
// 简化定义
// PromiseLike<T> 是一个内置接口，表示一个具有 then 方法的对象类型 Promise 的鸭子类型。
type Awaited<T> = T extends PromiseLike<infer R> ? Awaited<R> : T;
```

## NoInfer

`NoInfer<Type>` 用于防止 `TypeScript` 从泛型函数内部推断类型。它是一个固有类型，没有更底层的实现。

```ts
// 以从函数入惨里推断出 result1 类型是 'hello'
const rs1 = <T>(value: T) => value;
const result1 = rs1('hello'); // 'hello'

// NoInfer<T> 包装 value, 使 value 无法成为有效推断来源 T
const rs2 = <T>(value: NoInfer<T>) => value;
const result2 = rs2('hello'); // unknown

// 需要明确提供范型才能获得 rs2 的返回类型
const result3 = rs2<'hello'>('hello'); //  "hello"
```

## Intrinsic String Manipulation Types

四个固有的字符串操作类型：

- `Uppercase<S>` ：将字符串中的每个字符转换为大写。
- `Lowercase<S>` ：将字符串中的每个字符转换为小写。
- `Capitalize<S>` ：将字符串中的第一个字符转换为大写。
- `Uncapitalize<S>` ：将字符串中的第一个字符转换为小写。

```ts
type Greeting = 'Hello, world';
type UpperGreeting = Uppercase<Greeting>; // "HELLO, WORLD"
type LowercaseGreeting = Lowercase<Greeting>; // "hello, world"
type CapitalizedGreeting = Capitalize<Greeting>; // "Hello, world"
type UncapitalizedGreeting = Uncapitalize<Greeting>; // "hello, world"
```
