---
outline: [2, 3]
---

# ES6+

## 块级作用域绑定

### `var` 声明和变量提升机制

在函数作用域或全局作用域中通过关键字 `var` 声明的变量，无论实际上是在哪里声明的，都会被当成在当前作用域顶部声明的变量，这就是变量提升。  
除了 `var` 变量会提升以外，`function` 函数声明也存在 hoisting 机制。

```js
getValue(false); // 输出 undefined

function getValue(condition) {
  if (condition) {
    var value = 'value';
    return value;
  } else {
    // 这里可以访问到 value，只不过值为 undefined
    console.log(value);
    return null;
  }
}
```

```js
console.log(fn); // undefined
if (true) {
  fn(); // fn...
  function fn() {
    console.log('fn...');
  }
}
console.log(fn); // Function
```

::: warning 注意
提升以函数为界限，提升不可能提升到函数外面。
:::

### 块级声明

块级声明用于声明在指定的作用域之外无妨访问的变量，块级作用域存在于函数内部和块中。

`let` 声明：

- `let` 声明和 `var` 声明的用法基本相同。
- `let` 声明的变量不会被提升。
- `let` 不能在同一个作用域中重复声明已经存在的变量，会报错。
- `let` 声明的变量作用域范围仅存在于当前的块中，程序进入块开始时被创建，程序退出块时被销毁。
- 全局作用域下使用 `let` 声明的变量不再挂载到 `window` 对象上。

`const` 声明：

- `const` 声明和 `let` 声明大多数情况是相同的。
- `const` 声明的量不能修改（栈空间）。
- `const` 声明的量必须赋值初始化。

### 暂时性死区

因为 `let` 和 `const` 声明的变量不会进行声明提升，所以在 `let` 和 `const` 变量声明之前任何访问此变量的操作都会引发错误

```js
if (condition) {
  // Error
  console.log(typeof value);
  let value = 'value';
}
```

### 块作用域绑定

在全局作用域下通过 `var` 声明一个变量，那么这个变量会挂载到全局对象 `window` 上。

```js
var num = 7;
console.log(window.num); // 7
```

使用 `let` 或者 `const` 在全局作用域下创建一个新的变量，这个变量不会添加到 `window` 上。

```js
let num = 7;
console.log(window.num); // undefined
```

> 最佳实践  
> 默认使用 `const`声明，只有确定变量的值会在后续需要修改时才会使用 `let` 声明  
> 因为大部分变量在初始化后不应再改变，而预料以外的变量值改变是很多 bug 的源头

## 代理和反射

代理（`Proxy`）：代理可以拦截 `JavaScript` 引擎内部目标的底层对象操作，这些底层操作被拦截后会触发响应特定操作的陷阱函数。

反射（`Reflect`）：反射 API 以 `Reflect` 对象的形式出现，对象中方法的默认特性与相同的底层操作一致，而代理可以覆写这些操作，每个代理陷阱对应一个命名和参数都相同的 `Reflect` 方法。

| 代理陷阱                   | 覆写特性                                                                    |
| :------------------------- | :-------------------------------------------------------------------------- |
| `get`                      | 读取一个属性值                                                              |
| `set`                      | 写入一个属性                                                                |
| `has`                      | `in` 操作符                                                                 |
| `apply`                    | 调用一个函数                                                                |
| `deleteProperty`           | `delete` 操作符                                                             |
| `construct`                | 用 `new` 调用一个函数                                                       |
| `getPrototypeOf`           | `Object.getPrototypeOf`                                                     |
| `setPrototypeOf`           | `Object.setPrototypeOf `                                                    |
| `isExtensible`             | `Object.isExtensible`                                                       |
| `preventExtensions`        | `Object.preventExtensions`                                                  |
| `getOwnPropertyDescriptor` | `Object.getOwnPropertyDescriptor`                                           |
| `defineProperty`           | `Object.defineProperty`                                                     |
| `ownKeys`                  | `Object.keys`、`Object.getOwnPropertyNames`、`Object.getOwnPropertySymbols` |

### 创建一个简单的代理

用 `Proxy` 构造函数创建代理需要传入两个参数：目标 `target` 和处理程序 `handler`。

处理程序 `handler` 是定义了一个或者多个陷阱的对象，在代理中，除了专门为操作定义的陷阱外，其余操作均使用默认特性，即意味着：不使用任何陷阱的处理程序等价于简单的转发代理。

```js
const target = {};
const proxy = new Proxy(target, {});
```

### 使用 `set` 陷阱

`set` 陷阱接受 4 个参数：

1. `trapTarget` 用于接受属性(代理的目标)的对象。
2. `key` 要写入的属性键(字符串或者 `Symbol` 类型)。
3. `value` 被写入属性的值。
4. `receiver` 操作发生的对象。

特点：`Reflect.set()`是 `set` 陷阱对应的反射方法和默认特性，它和 `set` 代理陷阱一样也接受相同的四个参数，以方便在陷阱中使用。如果属性已设置陷阱应该返回 `true`，否则返回 `false`。

```js
const target = {
  name: 'target'
};
const proxy = new Proxy(target, {
  set(trapTarget, key, value, receiver) {
    if (!trapTarget.hasOwnProperty(key)) {
      if (isNaN(value)) {
        throw new TypeError('属性值必须为数字');
      }
    }
    return Reflect.set(trapTarget, key, value, receiver);
  }
});

proxy.count = 1;
console.log(proxy.count); // 1
proxy.name = 'AAA';
console.log(proxy.name); // AAA

proxy.anotherName = 'BBB'; // 属性值非数字，抛出错误
```

### 使用 `get` 陷阱

`get` 陷阱接受 3 个参数：

1. `trapTarget` 被读取属性的源对象(代理的目标)。
2. `key` 要读取的属性键(字符串或者 `Symbol`)。
3. `receiver` 操作发生的对象。

`JavaScript` 有一个我们很常见的特性，当我们试图访问某个对象不存在的属性的时候，不会报错而是返回 `undefined`。如果这不是你想要的结果，那么可以通过 `get` 陷阱来验证对象结构。

```js
const proxy = new Proxy(
  {},
  {
    get(trapTarget, key, receiver) {
      if (!(key in trapTarget)) {
        throw new Error(`属性${key}不存在`);
      }
      return Reflect.get(trapTarget, key, receiver);
    }
  }
);
proxy.name = 'proxy';
console.log(proxy.name); // proxy
console.log(proxy.nme); // Error
```

### 使用 `has` 陷阱

`has` 陷阱接受 2 个参数：

1. `trapTarget` 读取属性的对象(代理的目标)。
2. `key` 要检查的属性键(字符串或者 `Symbol`)。

`in` 操作符可以用来检测对象中是否含有某个属性，如果自有属性或原型属性匹配这个名称或者 `Symbol` 就返回 `true`，否则返回 `false`。

```js
const target = {
  value: 123,
  name: 'AAA'
};
console.log('value' in target); // 自有属性返回 true
console.log('toString' in target); // 原型属性，继承自 Object，也返回 true

const proxy = new Proxy(target, {
  has(trapTarget, key) {
    // 屏蔽value属性
    if (key === 'value') {
      return false;
    } else {
      return Reflect.has(trapTarget, key);
    }
  }
});
console.log('value' in proxy); // false
console.log('name' in proxy); // true
console.log('toString' in proxy); // true
```

### 使用 `deleteProperty` 陷阱

`deleteProperty` 陷阱接受 2 个参数：

1. `trapTarget` 要删除属性的对象(代理的目标)。
2. `key` 要删除的属性键(字符串或者 `Symbol`)。

`delete` 操作符可以删除对象中的某个属性，删除成功则返回 `true`，删除失败则返回 `false`。如果有一个对象属性是不可以被删除的，我们可以通过 `deleteProperty` 陷阱方法来处理

```js
const target = {
  name: 'AAA',
  value: 123
};
const proxy = new Proxy(target, {
  deleteProperty(trapTarget, key) {
    if (key === 'value') {
      return false;
    } else {
      return Reflect.deleteProperty(trapTarget, key);
    }
  }
});

let result = delete proxy.value;
console.log(result); // false
console.log('value' in proxy); // true

result = delete proxy.name;
console.log(result); // true
console.log('name' in proxy); // false
```

### 使用原型代理陷阱

`setPrototypeOf` 陷阱接受 2 个参数：

1. `trapTarget` 接受原型设置的对象(代理的目标)。
2. `proto` 作为原型使用的对象。

`getPrototypeOf` 陷阱接受 1 个参数：

1. `trapTarget` 接受获取原型的对象(代理的目标)。

`ES6` 新增了 `Object.setPrototypeOf()` 方法，它是 `ES5` 中 `Object.getPrototypeOf()` 方法的补充。当我们想要在一个对象被设置原型或者读取原型的时候做一点什么，可以使用 `setPrototypeOf()` 陷阱和 `getPrototypeOf()` 陷阱。

```js
const target = {};
const proxy = new Proxy(target, {
  getPrototypeOf(trapTarget) {
    // 必须返回对象或者 null
    return null;
  },
  setPrototypeOf(trapTarget, proto) {
    // 只要返回的不是 false 的值，就代表设置原型成功。
    return false;
  }
});

const targetProto = Object.getPrototypeOf(target);
const proxyProto = Object.getPrototypeOf(proxy);
console.log(targetProto === Object.prototype); // true
console.log(proxyProto === Object.prototype); // false
console.log(proxyProto); // null

Object.setPrototypeOf(target, {}); // 设置成功
Object.setPrototypeOf(proxy, {}); // 抛出错误
```

#### 两组方法的区别

`Reflect.getPrototypeOf()` 方法和 `Reflect.setPrototypeOf()` 方法看起来和 `Object.getPrototypeOf()` 和 `Object.setPrototypeOf()` 看起来执行相似的操作，但它们还是有一些不同之处的：

1. `Reflect.getPrototypeOf()` 方法和 `Reflect.setPrototypeOf()` 方法底层操作，其赋予开发者可以访问之前只在内部操作的 `[[GetPrototypeOf]]` 和 `[[SetPrototypeOf]]` 权限。而 `Object.getPrototypeOf()` 和 `Object.setPrototypeOf()` 方法是高级操作，创建伊始就是方便开发者使用的。

2. 如果传入的参数不是对象，则 `Reflect.getPrototypeOf()` 会抛出错误，而 `Object.getPrototypeOf()` 方法则会在操作前先将参数强制转换为一个对象。

3. `Object.setPrototypeOf()` 方法会通过一个布尔值来表示操作是否成功，成功时返回 `true`，失败时返回 `false`。而 `Reflect.setPrototypeOf()` 设置失败时会抛出错误。

```js
const result = Object.getPrototypeOf(1);
console.log(result === Number.prototype); // true
Reflect.getPrototypeOf(1); // 抛出错误
```

### 使用对象可扩展陷阱

在 `ES6` 之前对象已经有两个方法来修正对象的可扩展性：`Object.isExtensible()` 和 `Object.preventExtensions()`，在 `ES6` 中可以通过代理中的 `isExtensible()` 和 `preventExtensions()` 陷阱拦截这两个方法并调用底层对象。

- `isExtensible()` 陷阱返回一个布尔值，表示对象是否可扩展，接受唯一参数 `trapTarget`。
- `preventExtensions()` 陷阱返回一个布尔值，表示操作是否成功，接受唯一参数 `trapTarget`。

```js
const target = {};
let proxy = new Proxy(target, {
  isExtensible(trapTarget) {
    return Reflect.isExtensible(trapTarget);
  },
  preventExtensions(trapTarget) {
    return Reflect.preventExtensions(trapTarget);
  }
});
console.log(Object.isExtensible(target)); // true
console.log(Object.isExtensible(proxy)); // true
Object.preventExtensions(proxy);
console.log(Object.isExtensible(target)); // false
console.log(Object.isExtensible(proxy)); // false

proxy = new Proxy(target, {
  isExtensible(trapTarget) {
    return Reflect.isExtensible(trapTarget);
  },
  preventExtensions(trapTarget) {
    return false;
  }
});
console.log(Object.isExtensible(target)); // true
console.log(Object.isExtensible(proxy)); // true
Object.preventExtensions(proxy);
console.log(Object.isExtensible(target)); // true
console.log(Object.isExtensible(proxy)); // true
```

- `Object.preventExtensions()` 无论传入的是否为一个对象，它总是返回该参数，而 `Reflect.isExtensible()` 方法如果传入一个非对象，则会抛出一个错误。
- `Object.isExtensible()` 当传入一个非对象值时，返回 `false`，而 `Reflect.isExtensible()` 则会抛出一个错误。

### 使用属性描述符陷阱

`Object.defineProperty` 陷阱接受 3 个参数：

1. `trapTarget` 要定义属性的对象(代理的目标)
2. `key` 属性的键。
3. `descriptor` 属性的描述符对象。

`Object.getOwnPropertyDescriptor` 陷阱接受 2 个参数：

1. `trapTarget` 要获取属性的对象(代理的目标)。
2. `key` 属性的键。

在代理中可以使用 `defineProperty` 和 `getOwnPropertyDescriptor` 陷阱函数分别拦截 `Object.defineProperty()` 和 `Object.getOwnPropertyDescriptor()` 方法的调用。

```js
const proxy = new Proxy(
  {},
  {
    defineProperty(trapTarget, key, descriptor) {
      if (typeof key === 'symbol') {
        return false;
      }
      return Reflect.defineProperty(trapTarget, key, descriptor);
    },
    getOwnPropertyDescriptor(trapTarget, key) {
      return Reflect.getOwnPropertyDescriptor(trapTarget, key);
    }
  }
);
Object.defineProperty(proxy, 'name', { value: 'AAA' });
console.log(proxy.name); // AAA
const descriptor = Object.getOwnPropertyDescriptor(proxy, 'name');
console.log(descriptor.value); // AAA

const nameSymbol = Symbol('name');
// 抛出错误
Object.defineProperty(proxy, nameSymbol, { value: 'BBB' });
```

::: warning 注意
`getOwnPropertyDescriptor()` 陷阱的返回值必须是一个 `null`、`undefined` 或者一个对象。如果返回的是一个对象，则对象的属性只能是 `enumerable`、`configurable`、`value`、`writable`、`get` 和 `set`，使用不被允许的属性会抛出一个错误。
:::

两组方法对比：

- `Object.defineProperty()` 方法和 `Reflect.defineProperty()` 方法只有返回值不同，前者只返回第一个参数；而后者返回值与操作有关，成功则返回 `true`，失败则返回 `false`。

```js
const target = {};
const result1 = Object.defineProperty(target, 'name', { value: 'AAA' });
const result2 = Reflect.defineProperty(target, 'name', { value: 'AAA' });
console.log(result1 === target); // true
console.log(result2); // true
```

- `Object.getOwnPropertyDescriptor()` 方法传入一个原始值作为参数，内部会把这个值强制转换为一个对象；而 `Reflect.getOwnPropertyDescriptor()` 方法传入一个原始值，则会抛出错误。

```js
const descriptor1 = Object.getOwnPropertyDescriptor(2, 'name');
console.log(descriptor1); // undefined

const descriptor2 = Reflect.getOwnPropertyDescriptor(2, 'name'); // Error
```

```js
let descriptor1 = Object.getOwnPropertyDescriptor(2, 'name');
console.log(descriptor1); // undefined
// 抛出错误
let descriptor2 = Reflect.getOwnPropertyDescriptor(2, 'name');
```

### 使用 `ownKeys` 陷阱

`ownKeys` 代理陷阱可以拦截内部方法 `[[OwnPropertyKeys]]`，我们通过返回一个数组的值来覆写其行为。这个数组被用于 `Object.keys()`、`Object.getOwnPropertyNames()`、`Object.getOwnPropertySymbols()` 和 `Object.assign()` 四个方法，其中 `Object.assign()`方法用数组来确定需要复制的属性。`ownKeys` 陷阱唯一接受的参数是操作的目标，返回值是一个数组或者类数组对象，否则就会抛出错误。

几种方法的区别：

- `Reflect.ownKeys()` 返回的数组中包含所有对象的自有属性的键名，包括字符串类型和 `Symbol` 类型。
- `Object.getOwnPropertyNames()`、`Object.keys()` 返回的数组中排除了 `Symbol` 类型。
- `Object.getOwnPropertySymbols()` 返回的数组中排出了字符串类型。
- `Object.assign()` 字符串和 `Symbol` 类型都支持。

```js
const proxy = new Proxy(
  {},
  {
    ownKeys(trapTarget) {
      return Reflect.ownKeys(trapTarget).filter(key => {
        // 排除属性开头带有_的键
        return typeof key !== 'string' || key[0] !== '_';
      });
    }
  }
);

const nameSymbol = Symbol('name');
proxy.name = 'AAA';
proxy._name = '_AAA';
proxy[nameSymbol] = 'Symbol';

console.log(Object.getOwnPropertyNames(proxy)); // ['name']
console.log(Object.keys(proxy)); // ['name']
console.log(Object.getOwnPropertySymbols(proxy)); // ['Symbol(name)']
```

### 使用 `apply` 和 `construct` 陷阱

`apply` 陷阱接 3 个参数：

1. `trapTarget` 被执行的函数(代理的目标)。
2. `thisArg` 函数被调用时内部 this 的值。
3. `argumentsList` 传递给函数的参数数组。

`construct` 陷阱函数接受 2 个参数：

1. `trapTarget` 被执行的函数(代理的目标)。
2. `argumentsList` 传递给函数的参数数组。

函数有两个内部方法 `[[Call]]` 和 `[[Construct]]`，当使用 `new` 调用时，执行 `[[Construct]]` 方法，不用 `new` 调用时，执行`[[Call]]` 方法。

#### 验证函数参数

```js
function sum(...values) {
  return values.reduce((pre, cur) => pre + cur, 0);
}
const sumProxy = new Proxy(sum, {
  apply(trapTarget, thisArg, argumentsList) {
    argumentsList.forEach(item => {
      if (typeof item !== 'number') {
        throw new TypeError('所有参数必须是数字类型');
      }
    });
    return Reflect.apply(trapTarget, thisArg, argumentsList);
  },
  construct(trapTarget, argumentsList) {
    throw new TypeError('该函数不能通过new来调用');
  }
});
console.log(sumProxy(1, 2, 3, 4, 5)); // 15
const proxy = new sumProxy(1, 2, 3, 4, 5); // Error
```

#### 不用 `new` 调用构造函数

`new.target` 元属性，它是用 `new` 调用函数时对该函数的引用，可以使用 `new.target` 的值来确定函数是否是通过 `new` 来调用

```js
function Numbers(...values) {
  if (typeof new.target === 'undefined') {
    throw new TypeError('该函数必须通过new来调用。');
  }
  this.values = values;
}

const NumbersProxy = new Proxy(Numbers, {
  construct(trapTarget, argumentsList) {
    return Reflect.construct(trapTarget, argumentsList);
  },
  apply(trapTarget, thisArg, argumentsList) {
    // 非 new 调用的形式来使用
    return Reflect.construct(trapTarget, argumentsList);
  }
});

const instance1 = new NumbersProxy(1, 2, 3, 4, 5);
const instance2 = NumbersProxy(1, 2, 3, 4, 5);
console.log(instance1.values); // [1, 2, 3, 4, 5]
console.log(instance2.values); // [1, 2, 3, 4, 5]

const instance = new Numbers(1, 2, 3, 4, 5);
console.log(instance.values); // [1, 2, 3, 4, 5]
Numbers(1, 2, 3, 4); // Error
```

#### 覆写抽象基类构造函数

`construct` 陷阱还接受第三个可选参数函数，其作用是被用作构造函数内部的 `new.target` 的值。

```js
class AbstractNumbers {
  constructor(...values) {
    if (new.target === AbstractNumbers) {
      throw new TypeError('此函数必须被继承');
    }
    this.values = values;
  }
}
let AbstractNumbersProxy = new Proxy(AbstractNumbers, {
  construct(trapTarget, argumentsList) {
    return Reflect.construct(trapTarget, argumentsList, function () {});
  }
});
let instance = new AbstractNumbersProxy(1, 2, 3, 4, 5);
console.log(instance.values); // 1, 2, 3, 4, 5
```

#### 可调用的类构造函数

使用 `apply` 代理陷阱实现不用 `new` 就能调用构造函数

```js
class Person {
  constructor(name) {
    this.name = name;
  }
}

const PersonProxy = new Proxy(Person, {
  apply(trapTarget, thisArg, argumentsList) {
    return new trapTarget(...argumentsList);
  }
});

const person = PersonProxy('AAA');
console.log(person.name); // AAA
console.log(person instanceof PersonProxy); // true
console.log(person instanceof Person); // true
```

### 可撤销代理

有时候我们希望能够对代理进行控制，让他能在需要的时候撤销代理，这个时候可以使用 `Proxy.revocable()` 函数来创建可撤销的代理，该方法采用与 Proxy 构造函数相同的参数，其返回值是具有以下属性的对象：

- `proxy` 可撤销的代理对象。
- `revoke` 撤销代理要调用的函数。

当调用 `revoke()` 函数的时候，不能通过 `proxy` 执行进一步的操作，任何与代理对象交互的尝试都会触发代理陷阱抛出错误。

```js
const target = {
  name: 'AAA'
};

const { proxy, revoke } = Proxy.revocable(target, {});

console.log(proxy.name); // AAA
revoke();
console.log(proxy.name); // 抛出错误
```

### 解决数组问题

在`ES6`之前我们无法完全模拟数组的行为：

- 添加新元素时增加 `length` 的值。
- 减少 `length` 的值可以删除元素。

```js
const colors = ['red', 'green', 'blue'];
console.log(colors.length); // 3

colors[3] = 'black';
console.log(colors.length); // 4
console.log(colors[3]); // black

colors.length = 2;
console.log(colors.length); // 2
console.log(colors); // ['red', 'green']
```

#### 检测数组索引

判断一个属性是否为数组索引，需要满足规范条件：当且仅当 `ToString(ToUnit32(P))` 等于 `P`，并且 `ToUnit32(P)` 不等于 `2³²-1`。

```js
// 通过规范中描述的算法将给定的值转换为无符号 32 位整数
function toUnit32(value) {
  return Math.floor(Math.abs(Number(value))) % Math.pow(2, 32);
}

// 将键转换为 uint32 结构，然后进行一次比较以确定这个键是否是数组索引
function isArrayIndex(key) {
  const numericKey = toUnit32(key);
  return String(numericKey) === key && numericKey < Math.pow(2, 32) - 1;
}
```

#### 添加新元素时增加 `length` 的值

```js
function toUnit32(value) {
  return Math.floor(Math.abs(Number(value))) % Math.pow(2, 32);
}

function isArrayIndex(key) {
  const numericKey = toUnit32(key);
  return String(numericKey) === key && numericKey < Math.pow(2, 32) - 1;
}

function createMyArray(length = 0) {
  return new Proxy(
    { length },
    {
      set(trapTarget, key, value) {
        let currentLength = Reflect.get(trapTarget, 'length');
        if (isArrayIndex(key)) {
          let numericKey = Number(key);
          if (numericKey >= currentLength) {
            Reflect.set(trapTarget, 'length', numericKey + 1);
          }
        }
        return Reflect.set(trapTarget, key, value);
      }
    }
  );
}

const colors = createMyArray(3);
console.log(colors.length); // 3

colors[0] = 'red';
colors[1] = 'green';
colors[2] = 'blue';
console.log(colors.length); // 3

colors[3] = 'black';
console.log(colors.length); // 4
console.log(colors[3]); // black
```

#### 减少 `length` 的值可以删除元素

```js
function toUnit32(value) {
  return Math.floor(Math.abs(Number(value))) % Math.pow(2, 32);
}

function isArrayIndex(key) {
  let numericKey = toUnit32(key);
  return String(numericKey) === key && numericKey < Math.pow(2, 32) - 1;
}

function createMyArray(length = 0) {
  return new Proxy(
    { length },
    {
      set(trapTarget, key, value) {
        let currentLength = Reflect.get(trapTarget, 'length');
        if (isArrayIndex(key)) {
          let numericKey = Number(key);
          if (numericKey >= currentLength) {
            Reflect.set(trapTarget, 'length', numericKey + 1);
          }
        } else if (key === 'length') {
          if (value < currentLength) {
            for (let index = currentLength - 1; index >= value; index--) {
              Reflect.deleteProperty(trapTarget, index);
            }
          }
        }
        return Reflect.set(trapTarget, key, value);
      }
    }
  );
}

const colors = createMyArray(3);
console.log(colors.length); // 3

colors[0] = 'red';
colors[1] = 'green';
colors[2] = 'blue';
colors[3] = 'black';
console.log(colors.length); // 4

colors.length = 2;
console.log(colors.length); // 2
console.log(colors[3]); // undefined
console.log(colors[2]); // undefined
console.log(colors[1]); // green
console.log(colors[0]); // red
```

### 将代理作为原型

从类构造函数返回代理，但每创建一个实例都要创建一个新代理，可以使用将代理用作原型，让所有实例共享一个代理。

```js
const target = {};
const newTarget = Object.create(
  new Proxy(target, {
    defineProperty(trapTarget, name, descriptor) {
      return false;
    }
  })
);
Object.defineProperty(newTarget, 'name', {
  value: 'newTarget'
});
console.log(newTarget.name); // newTarget
console.log(newTarget.hasOwnProperty('name')); // true
```

调用`Object.defineProperty()`方法并传入`newTarget`来创建一个名为`name`的自有属性，在对象上定义属性的操作不需要操作对象的原型，所以代理中的`defineProperty`陷阱永远不会被调用。正如你所看到的那样，这种方式限制了代理作为原型的能力，但依然有几个陷阱是十分有用的。

#### 在原型上使用 `get` 陷阱

调用内部方法 `[[Get]]` 读取属性的操作现查找自有属性，如果未找到指定名称的自有属性，则继续到原型中查找，直到没有更多可以查找的原型过程结束，如果设置一个 `get` 陷阱，就能捕获到在原型上查找属性的陷阱。

```js
const target = {};
const newTarget = Object.create(
  new Proxy(target, {
    get(trapTarget, key, receiver) {
      throw new ReferenceError(`${key}不存在。`);
    }
  })
);

newTarget.name = 'AAA';
console.log(newTarget.name); // AAA
console.log(newTarget.nme); // 抛出错误
```

#### 在原型上使用 `set` 陷阱

内部方法 `[[Set]]` 同样会检查目标对象中是否含有某个自有属性，如果不存在则继续在原型上查找。但现在最棘手的问题是：无论原型上是否存在同名属性，给该属性赋值时都将默认在实例中创建该属性。

```js
const target = {};
const thing = Object.create(
  new Proxy(target, {
    set(trapTarget, key, value, receiver) {
      return Reflect.set(trapTarget, key, value, receiver);
    }
  })
);

console.log(thing.hasOwnProperty('name')); // false
thing.name = 'AAA'; // 触发set陷阱
console.log(thing.name); // AAA
console.log(thing.hasOwnProperty('name')); // true
thing.name = 'BBB'; // 不触发set陷阱
console.log(thing.name); // BBB
```

#### 在原型上使用 `has` 陷阱

只有在搜索原型链上的代理对象时才会调用 `has` 陷阱，而当你用代理作为原型时，只有当指定名称没有对应的自有属性时才会调用 `has` 陷阱。

```js
const target = {};
const thing = Object.create(
  new Proxy(target, {
    has(trapTarget, key) {
      return Reflect.has(trapTarget, key);
    }
  })
);

console.log('name' in thing); // false，触发了原型上的has陷阱
thing.name = 'AAA';
console.log('name' in thing); // true，没有触发原型上的has陷阱
```

#### 将代理用作类的原型

由于类的`prototype`属性是不可写的，因此不能直接修改类来使用代理作为类的原型，但是可以通过继承的方法来让类误认为自己可以将代理用作自己的原型。

```js
function NoSuchProperty() {}
NoSuchProperty.prototype = new Proxy(
  {},
  {
    get(trapTarget, key, receiver) {
      throw new ReferenceError(`${key}不存在`);
    }
  }
);

const thing = new NoSuchProperty();
console.log(thing.name); // 抛出错误
```

使用 `ES6` 的 `extends` 语法，来让类实现继承。

```js
function NoSuchProperty() {}
NoSuchProperty.prototype = new Proxy(
  {},
  {
    get(trapTarget, key, receiver) {
      throw new ReferenceError(`${key}不存在`);
    }
  }
);
class Square extends NoSuchProperty {
  constructor(width, height) {
    super();
    this.width = width;
    this.height = height;
  }
}
let shape = new Square(2, 5);
let area1 = shape.width * shape.height;
console.log(area1); // 10
let area2 = shape.length * shape.height; // 抛出错误
```

`Square` 类继承 `NoSuchProperty`，所以它的原型链中包含代理，之后创建的 `shape` 对象是 `Square` 的新实例，它有两个自有属性：`width`和`height`。当我们访问 `shape` 实例上不存在的 `length` 属性时，会在原型链中查找，进而触发 `get` 陷阱，抛出一个错误。

## 模块化

`模块` 是自动运行在严格模式下并且没有办法退出运行的 `JavaScript` 代码，与共享一切架构相反，它有如下几个特点：

- 在模块顶部创建的变量不会自动被添加到全局共享作用域，而是仅在模块的顶级作用域中存在。
- 模块必须导出一些外部代码可以访问的元素，例如变量或者函数。
- 模块也可以从其他模块导入绑定。
- 在模块的顶部，`this` 的值是 `undefined`。

### `export` 导出

`export` 关键字将一部分已发布的代码暴露给其他模块。

```js
export const PI = 3.1415;

export function sum(num1, num2) {
  return num1 + num2;
}

export { KEY } from './key.js';
export { add as ADD } from './key.js';
export * from './key.js';

export default {
  PI,
  sum
};
```

::: warning 注意

1. 未暴露的变量和方法是私有的，外部无法访问。
2. 通过 `default` 关键字设置一个默认的导出值，导出时多次使用`default`关键字会报错。
3. 导入默认值和导入非默认值是可以混用的。
4. 可以重新导出一个导入值

:::

### `import` 导入

`import` 关键字在另一个模块中导入暴露的代码。

```js
import { PI } from './example.js';

import * as Example from './example.js';

import RG, { sum } from './example.js';
```

::: warning 注意

1. 当从模块中导入一个绑定时，它就好像使用了 `const` 定义的一样。结果是我们不能定义另一个同名的变量，也无法在 `import` 语句前使用标识符或改变绑定的值。
2. 可以导入整个模块作为一个单一的对象，然后所有的导出都可以作为对象的属性使用。
3. 不管在 `import` 语句中把一个模块写多少次，该模块始终只执行一次，因为导入模块执行后，实例化过的模块被保存在内存中，只要另一个 `import` 语句引用它就可以重复使用。
4. `export` 和 `import` 语句必须在其他语句和函数之外使用，在其中使用会报错。

:::

### 无绑定导入

无绑定导入最有可能被应用于创建 `polyfill` 和 `shim`。

模块中的顶层管理、函数和类不会自动出现在全局作用域中，但这并不意味这模块无法访问全局作用域。

```js
Array.prototype.pushAll = function (items) {
  if (!Array.isArray(items)) {
    throw new TypeError('参数必须是一个数组。');
  }
  return this.push(...items);
};
```

无绑定导入`array.js`：

```js
import './array.js';
let colors = ['red', 'green', 'blue'];
let items = [];
items.pushAll(colors);
```

### 加载模块

在`Web`浏览器中使用一个脚本文件，可以通过如下三种方式来实现：

- 在 `script` 元素中通过 `src` 属性指定一个加载代码的地址来加载 `js` 脚本。
- 将 `js` 代码内嵌到没有 `src` 属性的 `script` 元素中。
- 通过 `Web Worker` 或者 `Service Worker` 的方式加载并执行 `js` 代码。

为了完全支持模块的功能，`JavaScript`扩展了`script`元素的功能，使其能够通过设置`type/module`的形式来加载模块：

```js
// 外联一个模块文件
<script type="module" src="./math.js"></script>

// 内联模块代码
<script type="module">
  import { sum } from './example.js'
  sum(1, 2)
</script>
```

#### Web 浏览器中模块加载顺序

模块和脚本不同，它是独一无二的，可以通过 `import` 关键字来指明其所依赖的其他文件，并且这些文件必须加载进该模块才能正确执行，因此为了支持该功能，`<script type="module"></script>` 执行时自动应用 `defer` 属性。

```js
// 最先执行
<script type="module" src="./math.js"></script>
// 其次执行
<script type="module">
  import { sum } from './math.js'
</script>
// 最后执行
<script type="module" src="./math1.js"></script>
```

#### Web 浏览器中的异步模块加载

`async` 属性也可以应用在模块上，在 `<script type="module"></script>` 元素上应用 `async` 属性会让模块以类似于脚本的方式执行，唯一的区别在于：在模块执行前，模块中的所有导入资源必须全部下载下来。

```js
// 无法保证哪个模块先执行
<script type="module" src="./module1.js" async></script>
<script type="module" src="./module2.js" async></script>
```

#### 将模块作为 Worker 加载

为了支持加载模块，`HTML` 标准的开发者向 `Worker` 这些构造函数添加了第二个参数，第二个参数是一个对象，其 `type` 属性的默认值是 `script`，可以将 `type` 设置为 `module` 来加载模块文件。

```js
let worker = new Worker('math.js', { type: 'module' });
```

#### 浏览器模块说明符解析

浏览器要求模块说明符具有以下几种格式之一：

- 以`/`开头的解析为根目录开始。
- 以`./`开头的解析为当前目录开始。
- 以`../`开头的解析为父目录开始。
- `URL`格式。

```js
import { first } from '/example1.js';
import { second } from './example2.js';
import { three } from '../example3.js';
import { four } from 'https://www.baidu.com/example4.js';
```

下面这些看起来正常的模块说明符在浏览器中实际上是无效的：

```js
import { first } from 'example1.js';
import { second } from 'example/example2.js';
```

## 函数

### 形参默认值

```js
function fun(key, timeout = 2000, callback = () => {}) {
  // ...
}
```

::: tip
对于默认参数而言，除非不传或者主动传递 `undefined` 才会使用参数默认值  
如果传递 `null`，这是一个合法的参数，不会使用默认值。
:::

#### 形参默认值对 `arguments` 对象的影响

- 在 ES5 非严格模式下，如果修改参数的值，这些参数的值会同步反应到 `arguments` 对象中
- 而在 ES5 严格模式下，修改参数的值不再反应到 `arguments` 对象中
- 对于使用了 ES6 的形参默认值，`arguments` 对象的行为始终保持和 ES5 严格模式一样，无论当前是否为严格模式
- 即 `arguments` 总是等于最初传递的值，不会随着参数的改变而改变，总是可以使用 `arguments` 对象将参数还原为最初的值

```js
function mixArgs(first, second = 'B') {
  // arguments对象始终等于传递的值，形参默认值不会反映在arguments上
  console.log(arguments.length); // 1
  console.log(arguments[0]); // A
  console.log(arguments[1]); // undefined

  first = 'a';
  second = 'b';

  console.log(arguments[0]); // A
  console.log(arguments[1]); // undefined
}
mixArgs('A');
```

#### 默认参数的暂时性死区

在 `let` 和 `const` 变量声明之前尝试访问该变量会触发错误，在函数默认参数中也存在暂时性死区

```js
function add(first = second, second) {
  return first + second;
}
add(1, 1); // 2

// first 参数使用参数默认值，而此时 second 变量还没有初始化
add(undefined, 1); // 抛出错误
```

### 不定参数

JavaScript 的函数语法规定无论函数已定义的命名参数有多少个，都不限制调用时传入的实际参数的数量。

```js
function pick(object, ...keys) {
  let result = Object.create(null);
  for (let i = 0, len = keys.length; i < len; i++) {
    let item = keys[i];
    result[item] = object[item];
  }
  return result;
}
```

#### 不定参数的限制

- 一个函数最多只能有一个不定参数。
- 不定参数一定要放在所有参数的最后一个。
- 不能在对象字面量 `setter` 之中使用不定参数。

#### 展开运算符 `...`

展开运算符和不定参数是最为相似的，不定参数可以让我们指定多个各自独立的参数，并通过整合后的数组来访问；而展开运算符可以让你指定一个数组，将它们打散后作为各自独立的参数传入函数。

```js
const arr = [4, 10, 5, 6, 32];
// ES6 之前
console.log(Math.max.apply(Math, arr)); // 32
// 使用展开运算符
console.log(Math.max(...arr)); // 32
```

### 箭头函数

在 `ES6` 中，箭头函数是一种使用箭头 `=>` 定义函数的新语法，提供简洁的语法和解决 `this` 绑定问题，使得 `JavaScript` 编程更加方便和直观，消除了函数的二义性，尤其是在处理回调函数和高阶函数时。

与和传统的 `JavaScript` 函数的不同：

- 没有 `this`、`super`、`arguments` 和 `new.target` 绑定，箭头函数中的 `this`、`super`、`arguments` 和 `new.target` 这些值由外围最近一层非箭头函数所决定。
- 不能通过 `new` 关键词调用：因为箭头函数没有[[Construct]]函数，所以不能通过 `new` 关键词进行调用，如果使用 `new` 进行调用会抛出错误。
- 没有原型，因为不会通过 `new` 关键词进行调用，所以没有构建原型的需要，也就没有了 `prototype` 这个属性。
- 不可以改变 `this` 的绑定，在箭头函数的内部，`this` 的值不可改变(即不能通过 `call`、`apply` 或者 `bind` 等方法来改变)。
- 不支持 `arguments` 对象：箭头函数没有 `arguments` 绑定，所以必须使用命名参数或者不定参数这两种形式访问参数。
- 不支持重复的命名参数：无论是否处于严格模式，箭头函数都不支持重复的命名参数。

::: tip
箭头函数
:::

#### 箭头函数的语法

```js
// 无参数 无返回值
() => {};

// 无参数且只有一行表达式可省略 {}
() => 123;

// 一个参数可省略 ()
val => val;

// 多个参数 多行表达式
(a, b, c) => {
  //...
};
```

## 解构赋值

解构是一种打破数据结构，将其拆分为更小部分的过程。

### 对象解构

```js
const person = {
  name: 'Relsola',
  age: 24
};
const { name, age } = person;
console.log(name); // Relsola
console.log(age); // 24
```

### 解构赋值

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

### 解构默认值

使用解构赋值表达式时，如果指定的局部变量名称在对象中不存在，那么这个局部变量会被赋值为 `undefined`，此时可以随意指定一个默认值。

```js
const person = {
  name: 'Relsola',
  age: 24
};
const { name, age, sex = '男' } = person;
console.log(sex); // 男
```

### 为非同名变量赋值

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

### 嵌套对象结构

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

### 数组解构

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

### 解构参数

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

```js
//  Object.defineProperty() 实际上就是一个函数，给一个对象添加一个属性

const obj = {};

Object.defineProperty(obj, 'name', {
  // value: "", // value 这个属性的属性值
  enumerable: true, // 表示这个属性可以被遍历到(枚举)
  // writable: true, // 表示这个属性可以被更改
  set(value) {
    console.log(this); // { name: [Getter/Setter] }
    // this.name = value;
  },
  get() {
    return this.name;
  }
});

obj.name = 'obj';
/*
   proxy 代理相当于你找了一个中介
   
   因为proxy是一个代理类 所以你要new出来一个实例对象
     第一个参数 就是你要代理的那个对象
     第二个参数就是配置项

    get函数有两个参数 
        第一个参数target 是我们的代理对象
        第二个参数 key 就是访问的属性名
    
    set函数有三个参数
        第一个参数target 是我们的代理对象
        第二个参数是属性名
        第三个参数是设置的新值

    has 捕获in动作 
    delete 删除
*/

const proxyObj = new Proxy(obj, {
  get(target, key) {
    console.log(`${key}被访问量`);
    return target[key];
  },

  set(target, key, num) {
    console.log(`${key}被设置了`);
    return (target[key] = num);
  },

  has(target, key) {
    console.log('监听到 in', key);
    return key in target;
  },

  deleteProperty(target, key) {
    console.log('delete...', key);
    delete target[key];
  }
});

proxyObj.age = 18;
proxyObj.age;
'age' in proxyObj;
delete proxyObj.age;
```

## Set 和 Map 集合

### Set

`Set` 集合是一种有序列表，其中含有一些相互独立的非重复值，在 `Set` 集合中，不会对所存的值进行强制类型转换。

`Set` 集合的属性和方法：

- `Set` 构造函数：可以使用此构造函数创建一个 `Set` 集合。
- `add` 方法：可以向 `Set` 集合中添加一个元素。
- `delete` 方法：可以移除 `Set` 集合中的某一个元素。
- `clear` 方法：可以移除 `Set` 集合中所有的元素。
- `has` 方法：判断给定的元素是否在 `Set` 集合中。
- `size` 属性：`Set` 集合的长度。

```js
const set = new Set();
set.add(5);
set.add('5');

// 重复添加的值会被忽略
set.add(5);
console.log(set.size); // 2

// 移除元素
console.log(set.has(5)); // true
set.delete(5);
console.log(set.has(5)); // false
console.log(set.size); // 1
```

::: tip 补充
`Set` 集合的构造函数可以接受任何可迭代对象作为参数，如 `Array`、`Set`、`Map`。  
`Set `集合的 `forEach()` 迭代第一和第二个参数是一样的。
:::

#### `Set` 集合转换为数组

因为 `Set` 集合不可以像数组那样通过索引去访问元素，最好的做法是将 `Set` 集合转换为数组。

```js
const set = new Set([1, 2, 3, 4]);

// 方法一：展开运算符
const arr1 = [...set];

// 方法二：Array.from方法
const arr2 = Array.from(set);
```

### WeakSet

因为 `Set` 实例中的引用存在，垃圾回收机制就不能释放该对象的内存空间，所以 `Set` 集合可以看作是一个强引用的集合。  
为了更好的处理 `Set` 集合的垃圾回收，引入了一个叫 `Weak Set` 的集合。

`Weak Set`集合只支持三种方法：`add`、`has`、`delete`。

```js
const weakSet = new WeakSet();
const key = {};
weakSet.add(key);
console.log(weakSet.has(key)); // true
weakSet.delete(key);
console.log(weakSet.has(key)); // false
```

`Set` 和 `WeakSet` 有许多共同的特性，也有一定的差别的：

- `Weak Set` 只能存储对象元素，向其添加非对象元素会导致抛出错误，同理 `has()` 和 `delete()` 传递非对象也同样会报错。
- `Weak Set` 不可迭代，也不暴露任何迭代器，因此也不支持 `forEach()` 方法。
- `Weak Set` 不支持 `size` 属性。

### Map

`Map` 类型是一种存储着许多键值对的有序列表，其中的键名和对应的值支持所有的数据类型，键名的等价性判断是通过调用 `Object.is` 方法来实现的。

`Map` 集合的方法和属性与 `Set` 类似，不过使用 `set` 添加键值对，`get` 获取值。

```js
const map = new Map();
map.set('name', 'AAA');
map.set('age', 23);
console.log(map.size); // 2
console.log(map.has('name')); // true
console.log(map.get('name')); // AAA
map.delete('name');
console.log(map.has('name')); // false
map.clear();
console.log(map.size); // 0
```

#### Map 集合的初始化方法

在初始化 `Map` 集合的时候，也可以像 `Set` 集合传入数组，但此时数组中的每一个元素都是一个子数组，子数组中包含一个键值对的键名和值两个元素。

```js
const map = new Map([
  ['name', 'AAA'],
  ['age', 23]
]);
```

#### Map 集合的 forEach() 方法

`Map` 集合中的 `forEach()` 方法的回调参数和数组类似，每一个参数的解释如下：

- 第一个参数是键名
- 第二个参数是值
- 第三个参数是`Map`集合本身

```js
const map = new Map([
  ['name', 'AAA'],
  ['age', 23]
]);
map.forEach((key, value, ownMap) => {
  console.log(`${key} ${value}`);
  console.log(ownMap === map);
});
// name AAA
// true
// age 23
// true
```

### WeakMap

`WeakMap` 它是一种存储着许多键值对的无序列表，集合中的键名必须是一个对象，如果使用非对象键名会报错。

`Weak Map` 集合只支持 `set()`、`get()`、`has()`、`delete()`。

```js
const key1 = {};
const key2 = {};
const key3 = {};
const weakMap = new WeakMap([
  [key1, 'AAA'],
  [key2, 23]
]);
weakMap.set(key3, '广东');

console.log(weakMap.has(key1)); // true
console.log(weakMap.get(key1)); // AAA
weakMap.delete(key1);
console.log(weakMap.has(key)); // false
```

`Map` 和 `Weak Map` 的差别的：

- `WeakMap` 集合的键名必须为对象，添加非对象会报错。
- `WeakMap` 集合不可迭代，因此不支持 `forEach()` 方法。
- `WeakMap` 集合不支持 `clear` 方法。
- `WeakMap` 集合不支持 `size` 属性。

## ES6+ 数据类型

`Symbol` `Number` `String` `Boolean` `Undefined` `Null` `Object`

```js
// Symbol数据是独一无二的 每一次生成都是一个独一无二的数据
console.log(Symbol('s') === Symbol('s'));

const symbol = Symbol();
const obj = {};
const obj1 = {};

obj[symbol] = 'hello';
const obj2 = { [symbol]: 'world' };
Object.defineProperty(obj1, symbol, { value: ' ' });

console.log(obj[symbol] + obj1[symbol] + obj2[symbol]); // hello world

// Set 不会出现重复的元素

/*  
set结构常用的四种操作方式
  1. add() 添加 返回值是set结构本身 size属性就是长度
  2. delete() 删除某个值 返回布尔值 表示删除是否成功
  3. has() 表示查找是否有某个值 返回是布尔
  4. clear() 清除所有成员 
*/
const set = new Set();
console.log(set.add('1'));
console.log(set.has('1'));
console.log(set.delete('1'));
console.log(set.clear('1'));

// WeakSet 只能放对象类型的数据，不能放基本数据类型
/* 
  WeakSet 对于元素的引用是弱引用，如果没有其他引用对某个对象进行引用，那么GC可以对该对象进行回收
  WeakSet 不能遍历 如果我们遍历了，那么其中的元素不能正常销毁
*/

// WeakSet可以保护我们的方法
const pws = new WeakSet();
class Person {
  constructor() {
    pws.add(this); // 实例化对象
  }

  running() {
    return pws.has(this) ? 'run...' : '调用错误';
  }
}

const p = new Person();
const run = p.running;

console.log(p.running());
console.log(run());

// map 字典结构 映射关系
/*  
 set(key,value) 设置值 返回的是整个map数据
 get(key) 获取 value
 has(key) 判断是否存在
 delete(key) 删除
 clear() 清空
 可以使用for of 或者forEach循环 
 */

// WeakMap 不能使用基本数据类型作为key
// set get delete has
```

## class

每个类都有有一个构造器 `constructor`

1. 内部创建了一个对象
2. 将构造器的显示原型赋值给创建出来的对象的隐式原型
3. 将对象赋值给 this，让 this 指向对象
4. 执行内部代码
5. 返回对象

```js
class Car {
  constructor(color, address) {
    this.trieNum = 4;
    this.color = color;
    this._address = address ?? '北京';
  }

  // 共有的属性 会放到原型对象上
  running() {
    console.log('running..');
  }

  // 静态属性只能由构造器访问
  static eating() {
    console.log('eating..');
  }

  //设置器和访问器 (get,set)对我们的获取动作和获取动作做监听
  get address() {
    console.log(`get被调用了,address被访问了`);
    return this._address;
  }

  //访问器
  set address(value) {
    console.log('set被调用了');
    this._address = value;
  }
}

const car = new Car('white', '北京');
console.log(car);

//hasOwnProperty 判断一个对象上是否有某个属性(对象本身)
console.log(car.hasOwnProperty('color')); // true

car.running();
console.log(car.__proto__.hasOwnProperty('running')); // true

console.log(car.address);
console.log(car._address);
car.address = '上海';

//当你想继承一个类的时候 需要用extends
class BYD extends Car {
  constructor(color, type) {
    // super 继承父类的属性 等于调用了父类的constructor
    super(color);

    // 一定要把super放到上面
    this.type = type;
  }
}
const byd = new BYD('white', '宋');
console.log(byd);

console.log(byd.__proto__.__proto__.hasOwnProperty('running')); // true
```

## Promise

ES6 提出了 promise 主要是为了解决异步问题

- 异步问题具体是指
- 异步代码和同步代码 先执行同步代码 后执行异步代码
- 所以 一旦一个代码块中出现了异步代码，代码的执行顺序就和我们代码的书写顺序不一样
- 所以实际上我们想解决的问题是 书写顺序和执行顺序不一致的问题

每个 Promise 对象有三种状态：等待态 成功态 失败态  
对于一个 promise 对象来说，当我们成功或失败后 不能再对其进行转换 只能从等待态到成功态，或者失败态

Promise 的立即执行函数有两个参数 `resolve` 和 `reject`

- 第一个参数(resolve) 将 promise 变成成功态
- 第二个参数(reject) 将 promise 变成失败态

resolve 的参数有三种情况

1. 普通的数据 会让 `promise` 对象变成成功态 数据就是终值
2. `promise` 对象 此时 `promise` 成功还是失败 取决于内部 `promise` 是成功还是失败
3. `thenable` (当做一个不完整的 `promise` 对象) 外面的 p1 是成功还是失败 取决于内部的 `thenable` 是成功还是失败

`then` 函数

- 可以用来处理我们成功态的 promise 或者失败的 promise 的后续工作
- 每一个 promise 对象都有一个 then 函数
- 这个 then 函数有两个参数，都是函数
- 第一个函数表示成功后的回调函数
- 第二个函数表示失败后的回调函数
- 这两个参数函数都有一个阐述，表示接受终值
- 当你的 promise 对象不出现状态改变的时候 就不会有后续的操作
- then 的返回值也是一个 promise 对象

```js
const result = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve({
      then(resolve, reject) {
        resolve('成功');
      }
    });
  }, 2000);
});

result
  .then(
    res => {
      throw res;
    },
    err => {
      console.log('err...', err);
    }
  )
  .then(
    res => {
      console.log('res...', res);
    },
    err => {
      console.log('err...', err);
    }
  );

// catch 捕获失败的promise
result
  .then(res => {
    throw res;
  })
  .catch(err => {
    console.log('err...', err);
  });

// Promise 其他方法

result.finally(() => {}); // 不管你成功还是失败 最终都会执行

Promise.resolve(); // 创建一个成功的promise对象

Promise.reject(); // 创建一个失败的promise对象

Promise.all([]).then(); // 所有的promise都成功后得到所有的promise成功的结果

Promise.allSettled([]).then(); // 得到所有promise的结果 不管成功还是失败

Promise.race([]).then(); // 等待第一个promise有结果 不管成功或失败

Promise.any(); // 得到最先成功的promise 或者得到所有promise都失败
```

### async-await

使用 async 修饰一个函数后，这个函数的返回值就变成了一个 `promise` 对象

任务环 先同步 后异步  
异步代码里也分顺序
定时器 监听 promise.then

异步代码分两种  
宏任务： 定时器 事件监听  
微任务 promise.then

```js
async function fun1() {
  return 123;
}

console.log(fun1()); // Promise { 123 }
fun1().then(res => {
  console.log(res);
}); // 123

async function fun2() {
  return new Promise(resolve => {
    resolve('321');
  });
}
console.log(fun2()); // Promise { <pending> }
fun2().then(res => {
  console.log(res);
}); // 321

async function fun3() {
  return {
    then(resolve, reject) {
      reject('777');
    }
  };
}
console.log(fun3()); // Promise { <pending> }
fun3().catch(err => {
  console.log(err);
}); // 777

async function fun4() {
  throw 'aaa';
}
console.log(fun4()); // Promise { <rejected> 'aaa' }
fun4().catch(err => {
  console.log(err);
}); // aaa

console.log(1);
setImmediate(() => {
  console.log(2);
});
const fn = async () => {
  const result = await new Promise(resolve => {
    setTimeout(() => {
      console.log(3);
      resolve(4);
    }, 2000);
  });
  console.log(result);
  console.log(5);
};
fn();
console.log(6);

// 1 6 2 3 4 5
```

## 迭代器和生成器

### 迭代器

迭代器是一种特殊的对象，它具有一些专门为迭代过程设计的专有接口，所有迭代器都有一个叫 `next` 的方法，每次调用都返回一个结果对象。  
结果对象有两个属性，一个是 `value` 表示下一次将要返回的值；另外一个是 `done` ，它是一个布尔类型的值，当没有更多可返回的数据时返回 `true`。  
迭代器还会保存一个内部指针，用来指向当前集合中值的位置，每调用一次 `next` 方法，都会返回下一个可用的值。

`ES6` 引入迭代器的宗旨就是消除普通循环中的复杂性并减少循环中的错误。

创建一个迭代器：

```js
function createIterator(items) {
  let i = 0;
  return {
    next: function () {
      const done = i >= items.length;
      const value = done ? undefined : items[i++];
      return { done: done, value: value };
    }
  };
}

const iterator = createIterator([1, 2, 3]);
console.log(iterator.next()); // { value: 1, done: false }
console.log(iterator.next()); // { value: 2, done: false }
console.log(iterator.next()); // { value: 3, done: false }
console.log(iterator.next()); // { value: undefined, done: true }
```

### 生成器

生成器是一种返回迭代器的函数，通过 `function` 关键字后的 `*` 号来表示，函数中会用到新的关键词 `yield`。

```js
function* createIterator() {
  yield 1;
  yield 2;
  yield 3;
}
const iterator = createIterator();
console.log(iterator.next()); // { value: 1, done: false }
console.log(iterator.next()); // { value: 2, done: false }
console.log(iterator.next()); // { value: 3, done: false }
console.log(iterator.next()); // { value: undefined, done: true }
```

**生成器函数最重要的一点是：每执行完一条 `yield` 语句，函数就会自动终止**

一般函数一旦开始执行，除非遇到错误否则一直会向下执行直到 `return` 语句，生成器函数则是当执行完一条 `yield` 语句时，函数会自动停止执行，除非代码手动调用迭代器的 `next` 方法。

在循环中使用生成器

```js
function* createIterator(items) {
  for (let i = 0, len = items.length; i < len; i++) {
    yield items[i];
  }
}
const it = createIterator([1, 2, 3]);
console.log(it.next()); // { done: false, value: 1 }
console.log(it.next()); // { done: false, value: 2 }
console.log(it.next()); // { done: false, value: 3 }
console.log(it.next()); // { done: true, value: undefined }
```

::: warning 限制
`yield` 关键字只能在生成器内部使用，在其他地方使用会导致抛出错误，即使是在生成器内部的函数中使用也是如此。
:::

```js
function * createIterator (items) {
   // 抛出错误
  items.forEach(item => yield item + 1)
}
```

### 可迭代对象和 `for-of` 循环

可迭代对象具有 `Symbol.iterator` 属性，是一种与迭代器密切相关的对象。  
`Symbol.iterator` 通过指定的函数可以返回一个作用于附属对象的迭代器。  
在 `ES6` 中，所有的集合对象(`Array` 、`Set` 、 `Map` )和字符串都是可迭代对象，这些对象中都有默认的迭代器。  
由于生成器默认会为 `Symbol.iterator` 属性赋值，因此所有通过生成器创建的迭代器都是可迭代对象。

`ES6` 新引入了 `for-of` 循环每执行一次都会调用可迭代对象的 `next` 方法，并将迭代器返回的结果对象的 `value` 属性存储在一个变量中，循环将持续执行这一过程直到返回对象的 `done` 属性的值为 `true`。

```js
const value = [1, 2, 3];
for (const num of value) {
  console.log(num);
}
// 1
// 2
// 3
```

#### 访问默认的迭代器

可以通过 `Symbol.iterator` 来访问对象的默认迭代器

```js
const values = [1, 2, 3];
const it = values[Symbol.iterator]();
console.log(it.next()); // {done:false, value:1}
console.log(it.next()); // {done:false, value:2}
console.log(it.next()); // {done:false, value:3}
console.log(it.next()); // {done:true, value:undefined}
```

由于具有 `Symbol.iterator` 属性的对象都有默认的迭代器对象，因此可以用它来检测对象是否为可迭代对象：

```js
function isIterator(object) {
  return typeof object[Symbol.iterator] === 'function';
}

console.log(isIterator([1, 2, 3])); // true
console.log(isIterator('hello')); // true
console.log(isIterator(new Set())); // true
console.log(isIterator(new Map())); // true
```

#### 创建可迭代对象

默认情况下，我们自己定义的对象都是不可迭代对象，但如果给 `Symbol.iterator` 属性添加一个生成器，则可以将其变为可迭代对象。

```js
const collection = {
  items: [1, 2, 3],
  *[Symbol.iterator]() {
    for (const item of this.items) {
      yield item;
    }
  }
};
for (const value of collection) {
  console.log(value);
}
// 1
// 2
// 3
```

### 内建迭代器

在`ES6`中有三种类型的集合对象：`Array` 数组、`Set` 集合、`Map` 集合，它们都内建了如下三种迭代器：

- `entries`：返回一个迭代器，其值为多个键值对。
- `values`：返回一个迭代器，其值为集合的值。
- `keys`：返回一个迭代器，其值为集合中的所有键名。

#### `entries()` 迭代器：

```js
const colors = ['red', 'green', 'blue'];
const set = new Set([1, 2, 3]);
const map = new Map([
  ['name', 'AAA'],
  ['age', 23],
  ['address', '广东']
]);

for (let item of colors.entries()) {
  console.log(item);
  // [0, 'red']
  // [1, 'green']
  // [2, 'blue']
}
for (let item of set.entries()) {
  console.log(item);
  // [1, 1]
  // [2, 2]
  // [3, 3]
}
for (let item of map.entries()) {
  console.log(item);
  // ['name', 'AAA']
  // ['age', 23]
  // ['address', '广东']
}
```

#### `values` 迭代器：

```js
const colors = ['red', 'green', 'blue'];
const set = new Set([1, 2, 3]);
const map = new Map([
  ['name', 'AAA'],
  ['age', 23],
  ['address', '广东']
]);

for (let item of colors.values()) {
  console.log(item);
  // red
  // green
  // blue
}
for (let item of set.values()) {
  console.log(item);
  // 1
  // 2
  // 3
}
for (let item of map.values()) {
  console.log(item);
  // AAA
  // 23
  // 广东
}
```

#### `keys` 迭代器：

```js
const colors = ['red', 'green', 'blue'];
const set = new Set([1, 2, 3]);
const map = new Map([
  ['name', 'AAA'],
  ['age', 23],
  ['address', '广东']
]);

for (let item of colors.keys()) {
  console.log(item);
  // 0
  // 1
  // 2
}
for (let item of set.keys()) {
  console.log(item);
  // 1
  // 2
  // 3
}
for (let item of map.keys()) {
  console.log(item);
  // name
  // age
  // address
}
```

#### 不同集合类型的默认迭代器

每一个集合类型都有一个默认的迭代器，在 `for-of` 循环中，如果没有显示的指定则使用默认的迭代器

- `Array` 和 `Set` 集合默认迭代器为`values`。
- `Map` 集合默认为`entries`。

```js
const colors = ['red', 'green', 'blue'];
const set = new Set([1, 2, 3]);
const map = new Map([
  ['name', 'AAA'],
  ['age', 23],
  ['address', '广东']
]);
for (let item of colors) {
  console.log(item);
  // red
  // green
  // blue
}
for (let item of set) {
  console.log(item);
  // 1
  // 2
  // 3
}
for (let item of map) {
  console.log(item);
  // ['name', 'AAA']
  // ['age', 23]
  // ['address', '广东']
}
```

#### 解构和 `for-of` 循环

如果在 `for-of` 循环中使用解构语法，则可以简化编码过程。

```js
const map = new Map([
  ['name', 'AAA'],
  ['age', 23],
  ['address', '广东']
]);
for (let [key, value] of map.entries()) {
  console.log(key, value);
  // name AAA
  // age 23
  // address 广东
}
```

#### 字符串迭代器

```js
const message = 'Hello';
for (let i = 0, len = message.length; i < len; i++) {
  console.log(message[i]);
  // H
  // e
  // l
  // l
  // o
}
```

#### `NodeList` 迭代器

`DOM` 标准中有一个 `NodeList` 类型，代表页面文档中所有元素的集合。`ES6` 为其添加了默认的迭代器，其行为和数组的默认迭代器一致。

```js
const divs = document.getElementByTagNames('div');
for (const div of divs) {
  console.log(div);
}
```

### 展开运算符和非数组可迭代对象

使用 `...` 展开运算符的过程中，操作 `Set` 集合的默认可迭代对象 `values`，从迭代器中读取所有值，然后按照返回顺序将他们依次插入到数组中。

```js
const set = new Set([1, 2, 3, 4]);
const array = [...set];
console.log(array); // [1, 2, 3, 4]
```

使用 `...` 展开运算符的过程中，操作 `Map` 集合的默认可迭代对象 `entries`，从迭代器中读取多组键值对，依次插入数组中。

```js
const map = new Map([
  ['name', 'AAA'],
  ['age', 23],
  ['address', '广东']
]);
const array = [...map];
console.log(array); // [['name', 'AAA'], ['age', 23], ['address', '广东']]
```

使用 `...` 展开运算符的过程中，操作 `Array` 集合的默认可迭代对象 `values`，从迭代器中读取所有值，然后按照返回顺序依次将他们插入到数组中。

```js
const arr1 = ['red', 'green', 'blue'];
const arr2 = ['yellow', 'white', 'black'];
const array = [...arr1, ...arr2];
console.log(array); // ['red', 'green', 'blue', 'yellow', 'white', 'black']
```

### 高级迭代器功能

#### 给迭代器传递参数

如果给迭代器 `next()` 方法传递参数，则这个参数的值就会替代生成器内部上一条 `yield` 语句的返回值。

```js
function* createIterator() {
  const first = yield 1;
  const second = yield first + 2;
  yield second + 3;
}
const it = createIterator();
console.log(it.next(11)); // {done: false, value: 1}
console.log(it.next(4)); // {done: false, value: 6}
console.log(it.next(5)); // {done: false, value: 8}
console.log(it.next()); // {done: true, value: undefined}
```

#### 在迭代器中抛出错误

除了给迭代器传递数据外，还可以给他传递错误条件，让其恢复执行时抛出一个错误。

```js
function* createIterator() {
  const first = yield 1;
  const second = yield first + 2;
  // 不会被执行
  yield second + 3;
}
const it = createIterator();
console.log(it.next()); // {done: false, value: 1}
console.log(it.next(4)); // {done: false, value: 6}
console.log(it.throw(new Error('break'))); // 抛出错误
```

可以使用`try-catch`语句来捕获这种错误。

```js
function* createIterator() {
  let first = yield 1;
  let second;
  try {
    second = yield first + 2;
  } catch (error) {
    second = 6;
  }
  yield second + 3;
}
let it = createIterator();
console.log(it.next()); // {done: false, value: 1}
console.log(it.next(4)); // {done: false, value: 6}
console.log(it.throw(new Error('break'))); // {done: false, value: 9}
console.log(it.next()); // {done: true, value: undefined}
```

#### 生成器返回语句

由于生成器也是函数，因此可以通过 `return` 语句提前退出函数执行，对于最后一次 `next()` 方法调用，可以主动为其指定一个返回值。  
`return` 语句表示所有的操作都已经完成，`done` 会被设置成 `true` ，如果同时提供了响应的值，则 `value` 会被设置为这个值。

```js
function* createIterator() {
  yield 1;
  return 2;
  // 不会被执行
  yield 3;
  yield 4;
}
let it = createIterator();
console.log(it.next()); // {done: false, value: 1}
console.log(it.next()); // {done: true, value: 2}
console.log(it.next()); // {done: true, value: undefined}
```

::: warning 注意
展开运算符和 `for-of` 循环会直接忽略通过 `return` 语句指定的任何返回值，因为只要 `done` 被设置为 `true` ，就立即停止读取其他的值。
:::

```js
const obj = {
  items: [1, 2, 3, 4, 5],
  *[Symbol.iterator]() {
    for (let i = 0, len = this.items.length; i < len; i++) {
      if (i === 3) {
        return 300;
      } else {
        yield this.items[i];
      }
    }
  }
};
for (let value of obj) {
  console.log(value);
  // 1
  // 2
  // 3
}
console.log([...obj]); // [1, 2, 3]
```

#### 委托生成器

将两个迭代器合二为一，这样就可以创建一个生成器，再给 `yield` 语句添加一个星号，以达到将生成数据的过程委托给其他迭代器。

```js
function* createColorIterator() {
  yield ['red', 'green', 'blue'];
}
function* createNumberIterator() {
  yield [1, 2, 3, 4];
}
function* createCombineIterator() {
  yield* createColorIterator();
  yield* createNumberIterator();
}
let it = createCombineIterator();
console.log(it.next().value); // ['red', 'green', 'blue']
console.log(it.next().value); // [1, 2, 3, 4]
console.log(it.next().value); // undefined
```

## ES6+ 其他新增特性

### 对象字面量的扩展

- 属性初始值的简写：当对象的属性和本地变量同名时，只写属性即可。
- 对象方法的简写： 消除了冒号和 `function` 关键字。
- 可计算属性名：在定义对象时，对象的属性值可通过变量来计算。

```js
const name = 'Rel';
const firstName = 'first name';
const person = {
  name,
  [firstName]: 'sola',
  sum(a, b) {
    return a + b;
  }
};
```

### 模板字符串

- 模板字符串是 `ES6` 中引入的一种新的字符串语法，它允许在字符串中插入变量或表达式，而不需要使用字符串拼接符号。
- 模板字符串使用反引号 ` `` `包围，并使用 `${}` 语法来插入变量或表达式。
- 在 `${}` 语法中，我们可以放置任何有效的 `JavaScript` 表达式，这些表达式的值将被插入到字符串中。

```js
const name = 'world';
console.log(`hello ${name}`); // hello world
```
