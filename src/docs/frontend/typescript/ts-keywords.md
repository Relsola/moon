# TS 关键字

- [`typeof` 获取变量或者属性的类型](#typeof)

- [`in` 遍历枚举类型](#in)

- [`keyof` 获取某种类型的所有键](#keyof)

- [`infer` 声明一个类型变量并且对它进行使用](#infer)

- [`extends` 添加泛型约束](#extends)

## typeof

`typeof` 的主要用途是在类型上下文中获取变量或者属性的类型

`typeof` 操作符除了可以获取对象的结构类型之外，它也可以用来获取函数对象的类型

```ts
interface Person {
	name: string;
	age: number;
}

const sem: Person = { name: '张三', age: 18 };
type Sem = typeof sem; // type Sem = Person
const son: Sem = { name: '李四', age: 17 };

const message = {
	name: 'jimmy',
	age: 18,
	address: {
		province: '四川',
		city: '成都'
	}
};
type Message = typeof message;

function toArray(x: number): Array<number> {
	return [x];
}

type Func = typeof toArray; // -> (x: number) => number[]

const num = 10;
type n = typeof num; // 也支持基本类型和字面量类型
```

## in

`in` 用来遍历枚举类型

```ts
type Keys = 'name' | 'age' | 'gender';

type Person = {
	[p in Keys]: number | string;
};

const tom: Person = {
	name: 'Relsola',
	age: 17,
	gender: 'man'
};
```

## keyof

`keyof` 可以用于获取某种类型的所有键，其返回类型是联合类型。

::: tip 注意
在 `TypeScript` 中支持两种索引签名，数字索引和字符串索引  
JavaScript 在执行索引操作时，会先把数值索引先转换为字符串索引  
所以 `keyof { [x: string]: Person }` 的结果会返回 `string | number`  
数字索引则 `keyof { [index: number]: string }` 返回 `number`
:::

```ts
interface Person {
	name: string;
	age: number;
}
type K1 = keyof Person; // "name" | "age"
type K2 = keyof []; // "length"  | "pop" | "push" ...
type K3 = keyof { [x: string]: Person }; // string | number

let k1: K1 = 'name';
k1 = 'age';

let k2: K2 = 2; // 数组是数字索引
k2 = 'join';

let k3: K3 = 4;
k3 = 'this is string';
```

`keyof` 也支持基本数据类型

```ts
let K1: keyof boolean; // let K1: "valueOf"
let K2: keyof number; // let K2: "toString" | "toFixed"  ...
let K3: keyof symbol; // let K1: "valueOf" ...
```

`keyof` 获取返回值类型

```ts
// 返回值是any
function prop(obj: object, key: string) {
	return obj[key];
}

function props<T extends object, K extends keyof T>(obj: T, key: K) {
	return obj[key];
}

type Todo = {
	id: number;
	text: string;
	done: boolean;
};

const todo: Todo = {
	id: 1,
	text: 'learn typescript keyof',
	done: false
};

const id = props(todo, 'id'); // const id: number
const text = props(todo, 'text'); // const text: string
const done = props(todo, 'done'); // const done: boolean
const date = props(todo, 'date'); // Error
```

## infer

在条件类型语句中，可以用 `infer` 声明一个类型变量并且对它进行使用。

获取函数返回值的类型

```ts
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
const sum = (a: number, b: number) => a + b;

type SumReturnType = ReturnType<typeof sum>; // number
```

获取数组里的元素类型

```ts
type ArrayElementType<T> = T extends (infer U)[] ? U : never;
const numbers = [1, 2, 3, '4', '5']; // (string | number)[]

type NumberType = ArrayElementType<typeof numbers>; // string | number
```

提取 `Promise` 的 `resolved` 类型

```ts
type ResolvedType<T> = T extends Promise<infer R> ? R : never;
async function fetchData() {
	// 省略异步操作
	return 'data';
} // Promise<string>

type DataType = ResolvedType<ReturnType<typeof fetchData>>; // string
```

## extends

`extends` 关键字添加泛型约束。

```ts
interface Lengthwise {
	length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
	console.log(arg.length);
	return arg;
}

// 现在这个泛型函数被定义了约束，因此它不再是适用于任意类型：
loggingIdentity(3); // Error, number doesn't have a .length property

// 这时我们需要传入符合约束类型的值，必须包含length属性：
loggingIdentity({ length: 10, value: 3 });

// 条件类型约束
type TypeName<T> = T extends string
	? 'string'
	: T extends number
	? 'number'
	: T extends boolean
	? 'boolean'
	: T extends undefined
	? 'undefined'
	: 'object';

type TypeA = TypeName<string>; // "string"
type TypeB = TypeName<number>; // "number"
type TypeC = TypeName<boolean>; // "boolean"
type TypeD = TypeName<undefined>; // "undefined"
type TypeE = TypeName<object>; // "object"

// 条件类型递归
type Flatten<T> = T extends Array<infer U> ? Flatten<U> : T;

type NestedArray = [1, [2, [3, [4]]]];
type FlattenedArray = Flatten<NestedArray>; // 1 | 2 | 3 | 4
```
