# 接口

## 接口

在面向对象语言中，接口（`Interfaces`）是一个很重要的概念，它是对行为的抽象，而具体如何行动需要由类（`classes`）去实现（`implement`）。

`TypeScript` 中的接口是一个非常灵活的概念，除了可用于**对类的一部分行为进行抽象**以外，也常用于对**对象的形状（`Shape`）**进行描述。

接口一般首字母大写，定义的变量比接口少了一些属性是不允许的，多一些属性也是不允许的。

```ts
interface Person {
	name: string;
	age: number;
	once?: number; // 可选属性
}

let Tom: Person = { name: 'Tom', age: 18 };
let Tom1: Person = { name: 'Tom', age: 18, gender: '男' }; // Error
let Tom2: Person = { name: 'Tom' }; // Error
```

## 任意属性

有时候我们希望一个接口中除了包含必选和可选属性之外，还允许有其他的任意属性，这时我们可以使用 **索引签名** 的形式来满足上述要求。

需要注意的是，一旦定义了任意属性，那么确定属性和可选属性的类型都必须是它的类型的子集。

一个接口中只能定义一个任意属性，如果接口中有多个类型的属性，则可以在任意属性中使用联合类型。

```ts
interface Person {
	readonly name: string;
	age?: number; // 这里真实的类型应该为：number | undefined
	[key: string]: string | number | undefined;
}

const tom: Person = {
	name: 'Tom',
	age: 17,
	gender: 'male'
};
```

只读属性用于限制只能在对象刚刚创建的时候修改其值，`TypeScript` 还提供了 `ReadonlyArray<T>` 类型，确保数组创建后再也不能被修改。

```ts
let a: number[] = [1, 2, 3];
let ro: ReadonlyArray<number> = a;

ro[0] = 12; // Error
ro.push(5); // Error
ro.length = 100; // Error
a = ro; // Error
```

## 接口与类型别名的区别

实际上，在大多数的情况下使用接口类型和类型别名的效果等价，但是在某些特定的场景下这两者还是存在很大区别。

`TypeScript` 的核心原则之一是对值所具有的结构进行类型检查，而接口的作用就是为这些类型命名和为你的代码或第三方代码定义数据模型。

`type`（类型别名） 会给一个类型起个新名字，`type` 有时和 `interface` 很像，但是可以作用于原始值（基本类型），联合类型，元组以及其它任何你需要手写的类型，起别名不会新建一个类型，它创建了一个新 名字来引用那个类型，给基本类型起别名通常没什么用，尽管可以做为文档的一种形式使用。

- 接口可以定义多次，会被自动合并为单个接口，类型别名不可以
- 接口只能给对象指定类型，类型别名可以为任意类型指定别名。
- 接口通过 `extends` 关键字进行继承，类型别名的扩展就是交叉类型，通过 `&` 来实现。
- `type` 可以使用 `in` 关键字生成映射类型，`interface` 不行

::: tip 建议
公共的用 `interface` 实现，不能用 `interface` 实现的再用 `type` 实现
:::

`interface`

```ts
interface Point {
	x: number;
}

interface Point {
	y: number;
}

interface SetPoint {
	(x: number, y: number): void;
}

const point: Point = { x: 1, y: 2 };
```

`Type`

```ts
// primitive
type Name = string;

// object
type PartialPointX = { x: number };
type PartialPointY = { y: number };
type SetPointType = (x: number, y: number) => void;

// union
type PartialPoint = PartialPointX | PartialPointY;

// tuple
type Data = [number, string];

// dom
let div = document.createElement('div');
type B = typeof div;

// 映射
type Keys = 'name' | 'age';
type DudeType = {
	[key in Keys]: string | number;
};
const tom: DudeType = {
	name: 'Tom',
	age: 18
};
```

扩展：

- 两者的扩展方式不同，但并不互斥，接口可以扩展类型别名，同理，类型别名也可以扩展接口。
- 接口的扩展就是继承，通过 `extends` 来实现，类型别名的扩展就是交叉类型，通过 `&` 来实现。

1. 接口扩展接口

```ts
interface PointX {
	x: number;
}

interface Point extends PointX {
	y: number;
}

let point: Point = { x: 1, y: 2 };
```

2. 类型别名扩展类型别名

```ts
type PointX = { x: number };
type Point = PointX & { y: number };

let point: Point = { x: 1, y: 2 };
```

3. 接口扩展类型别名

```ts
type PointX = { x: number };

interface Point extends PointX {
	y: number;
}
```

4. 类型别名扩展接口

```ts
interface PointX {
	x: number;
}

type Point = PointX & { y: number };
```

## 绕开额外属性检查的方式

1. 鸭式辨型法

下面代码，在参数里写对象就相当于是直接给 `labeledObj` 赋值，这个对象有严格的类型定义，所以不能多参或少参。  
而当你在外面将该对象用另一个变量 `myObj` 接收，`myObj` 不会经过额外属性检查，但会根据类型推论为 `let myObj: { size: number; label: string } = { size: 10, label: "Size 10 Object" }`。
然后将这个 `myObj` 再赋值给 `labeledObj`，此时根据类型的兼容性，两种类型对象，参照鸭式辨型法，因为都具有 `label` 属性，所以被认定为两个相同，故而可以用此法来绕开多余的类型检查。

```ts
interface LabeledValue {
	label: string;
}

function printLabel(labeledObj: LabeledValue) {
	console.log(labeledObj.label);
}

printLabel({ size: 10, label: 'Size 10 Object' }); // Error

let myObj = { size: 10, label: 'Size 10 Object' };
printLabel(myObj); // OK
```

2. 类型断言

类型断言的意义就等同于你在告诉程序，你很清楚自己在做什么，此时程序自然就不会再进行额外的属性检查了。

```ts
interface Props {
	name: string;
	age: number;
	money?: number;
}

let p: Props = {
	name: '张三',
	age: 25,
	money: -100000,
	girl: false
} as Props; // OK
```

3. 索引签名

```ts
interface Props {
	name: string;
	age: number;
	money?: number;
	[key: string]: boolean | string | number | undefined;
}

let p: Props = {
	name: '张三',
	age: 25,
	money: -100000,
	girl: false,
	once: 123
}; // OK
```
