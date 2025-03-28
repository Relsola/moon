# 类型推断

## 类型推断

在很多情况下，`TypeScript` 会根据上下文环境自动推断出变量的类型，无须我们再写明类型注解，我们把 `TypeScript` 这种基于赋值表达式推断类型的能力称之为类型推断。

在 `TypeScript` 中，具有初始化值的变量、有默认值的函数参数、函数返回的类型都可以根据上下文推断出来，比如我们能根据 `return` 语句推断函数返回的类型。

::: warning 注意
如果定义的时候没有赋值，不管之后有没有赋值，都会被推断成 `any` 类型而完全不被类型检查。
:::

```ts
let str: string = 'this is string';
let num: number = 1;
let bool: boolean = true;

// 等价于

let str = 'this is string';
let num = 1;
let bool = true;
```

```ts
const str: string = 'this is string';
const num: number = 1;
const bool: boolean = true;

// 不等价

const str = 'this is string';
const num = 1;
const bool = true;
```

```ts
const add1 = (a: number, b: number) => a + b;
const x1 = add1(1, 1); // 推断出 x1 的类型也是 number

const add2 = (a: number, b = 1) => a + b;
const x2 = add2(1);
const x3 = add2(1, '1'); // Error
```

## 类型断言

`TypeScript` 类型检测无法做到绝对智能，毕竟程序不能像人一样思考，有时会碰到我们比 `TypeScript` 更清楚实际类型的情况，通常这会发生在你清楚地知道一个实体具有比它现有类型更确切的类型。

通过类型断言这种方式可以告诉编译器，“相信我，我知道自己在干什么” ，类型断言好比其他语言里的类型转换，但是不进行特殊的数据检查和解构，它没有运行时的影响，只是在编译阶段起作用。

通常使用 `as` 语法做类型断言，第二种 `<>` 尖括号语法，两种方式虽然没有任何区别，但是尖括号格式会与 `react` 中 `JSX` 产生语法冲突，因此更推荐使用 `as` 语法。

```ts
// as 语法
const arr: number[] = [1, 2, 3, 4, 5];
const greaterThan2: number = arr.find(num => num > 2); // Error
const greaterThan2: number = arr.find(num => num > 2) as number;

//  尖括号 语法
let val: any = 'this is string';
val = (<string>val).length;
```

## 非空断言

在上下文中当类型检查器无法断定类型时，一个新的后缀表达式操作符 `!` 可以用于断言操作对象是非 `null` 和非 `undefined` 类型，具体而言，`x!` 将从 `x` 值域中排除 `null` 和 `undefined` 。

```ts
let str: null | undefined | string;
str.toString(); // Error

str?.toString(); // OK
str!.toString(); // OK

type n = () => number;

const fn = (ns: n | undefined) => {
	const num = ns(); // Error
	const num = ns!(); // OK
};
```
