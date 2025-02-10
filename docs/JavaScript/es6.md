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

可以用 `export` 关键字将一部分已发布的代码暴露给其他模块。

```js
// example.js
export let color = 'red';
export const PI = 3.1415;
export function sum(num1, num2) {
  return num1 + num2;
}
export class Rectangle {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }
}
// 模块私有的，外部无法访问
function privateFunc(num1, num2) {
  return num1 + num2;
}
```

### `import` 导入

从模块中导入的功能可以通过 `import` 关键字在另一个模块中访问，`import` 语句的两个部分分别是要导入的标识符和标识符从哪个模块导入。

```js
import { identifier1, identifier2 } from './example.js';
```

::: warning 注意
当从模块中导入一个绑定时，它就好像使用了`const`定义的一样。结果是我们不能定义另一个同名的变量，也无法在 `import` 语句前使用标识符或改变绑定的值。
:::

#### 导入单个绑定和导入多个绑定

```js
// 只导入一个
import { sum } from './math.js';
sum(1, 2);

// 导入多个
import { sum, minus } from './math.js';
sum(1, 2);
minus(1, 2);
```

#### 导入整个模块

特殊情况下，可以导入整个模块作为一个单一的对象，然后所有的导出都可以作为对象的属性使用：

```js
import * as Math from './math.js';
Math.sum(1, 2);
Math.minus(1, 2);
```

注意：

- 不管在`import`语句中把一个模块写多少次，该模块始终只执行一次，因为导入模块执行后，实例化过的模块被保存在内存中，只要另一个`import`语句引用它就可以重复使用。

```js
// math.js中的代码只执行了一次
import { sum } from './math.js';
import { minus } from './math.js';
```

- `export`和`import`语句必须在其他语句和函数之外使用，在其中使用会报错。

```js
if (flag) {
  // 报错
  export flag
}
function tryImport() {
  // 报错
  import * as Math from './math.js'
}
```

### 导出和导入时重命名

正如上面我们所看到的那样，导出的绑定就像`const`定义的变量一样，我们无法更改，如果多个模块之间存在同名绑定，这种情况下我们可以使用`as`来给绑定取一个别名，进而可以避免重名。

```js
// math.js 导出时别名
function sum(num1, num2) {
  return num1 + num2;
}
export { sum as SUM };

// math.js 导入时别名
import { SUM as sum } from './math.js';
console.log(typeof SUM); // undefined
sum(1, 2);
```

### 模块的默认值

模块的默认值指的是通过`default`关键字指定的单个变量、函数或者类，只能为每个模块设置一个默认的导出值，导出时多次使用`default`关键字会报错。

```js
// example.js 导出默认值
export default function (num1, num2) {
  return num1 + num2;
}
// example.js 导入默认值
import sum from './example.js';
sum(1, 2);
```

注意：导入默认值和导入非默认值是可以混用的，例如：
导出`example.js`：

```js
export const colors = ['red', 'green', 'blue'];
export default function (num1, num2) {
  return num1 + num2;
}
```

导入`example.js`:

```js
import sum, { colors } from './example.js';
```

### 重新导出一个绑定

有时候我们可能会重新导出我们已经导入的内容，就像下面这样：

```js
import { sum } from './example.js';
export { sum };
// 可以简写成
export { sum } from './example.js';
// 简写+别名
export { sum as SUM } from './example.js';
// 全部重新导出
export * from './example.js';
```

### 无绑定导入

无绑定导入最有可能被应用于创建`polyfill`和`shim`。<br/>

尽管我们已经知道模块中的顶层管理、函数和类不会自动出现在全局作用域中，但这并不意味这模块无法访问全局作用域。<br/>
例如：如果我们想向所有数组添加`pushAll()`方法，可以像下面这样：
无绑定导出`array.js`：

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

我们都知道，在`Web`浏览器中使用一个脚本文件，可以通过如下三种方式来实现：

- 在`script`元素中通过`src`属性指定一个加载代码的地址来加载`js`脚本。
- 将`js`代码内嵌到没有`src`属性的`script`元素中。
- 通过`Web Worker`或者`Service Worker`的方式加载并执行`js`代码。

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

模块和脚本不同，它是独一无二的，可以通过`import`关键字来指明其所依赖的其他文件，并且这些文件必须加载进该模块才能正确执行，因此为了支持该功能，`<script type="module"></script>`执行时自动应用`defer`属性。

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

`async`属性也可以应用在模块上，在`<script type="module"></script>`元素上应用`async`属性会让模块以类似于脚本的方式执行，唯一的区别在于：在模块执行前，模块中的所有导入资源必须全部下载下来。

```js
// 无法保证哪个模块先执行
<script type="module" src="./module1.js" async></script>
<script type="module" src="./module2.js" async></script>
```

#### 将模块作为 Worker 加载

为了支持加载模块，`HTML`标准的开发者向`Worker`这些构造函数添加了第二个参数，第二个参数是一个对象，其`type`属性的默认值是`script`，可以将`type`设置为`module`来加载模块文件。

```js
let worker = new Worker('math.js', {
  type: 'module'
});
```

#### 浏览器模块说明符解析

我们可以发现，我们之前的所有示例中，模块说明符使用的都是相对路径，浏览器要求模块说明符具有以下几种格式之一：

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

## 对象的扩展

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
  sayName() {
    console.log(this.name);
  }
};
```

### 新增方法

1. `Object.is`

2. `Object.assign`

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

在 ES6 中，箭头函数是一种使用箭头 => 定义函数的新语法，但它和传统的 JavaScript 函数有些许不同：

- 没有 `this`、`super`、`arguments` 和 `new.target` 绑定，箭头函数中的 `this`、`super`、`arguments` 和 `new.target` 这些值由外围最近一层非箭头函数所决定。
- 不能通过 `new` 关键词调用：因为箭头函数没有[[Construct]]函数，所以不能通过 `new` 关键词进行调用，如果使用 `new` 进行调用会抛出错误。
- 没有原型，因为不会通过 `new` 关键词进行调用，所以没有构建原型的需要，也就没有了 `prototype` 这个属性。
- 不可以改变 `this` 的绑定，在箭头函数的内部，`this` 的值不可改变(即不能通过 `call`、`apply` 或者 `bind` 等方法来改变)。
- 不支持 `arguments` 对象：箭头函数没有 `arguments` 绑定，所以必须使用命名参数或者不定参数这两种形式访问参数。
- 不支持重复的命名参数：无论是否处于严格模式，箭头函数都不支持重复的命名参数。

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

## 其余特性

1. `Array.includes()` 判断元素是否在数组里 返回布尔
2. 指数运算符 `2 ** 3`
3. `Object.values()` `Object.keys()` `Object.entries()`
4. String.padStart() String.padEnd()
5. Object.getOwnPropertyDescriptors() 获取到对象的描述
6. Array.flat() Array.flatMap() -> 先 map 再 flat
7. Object.fromEntries() 与 Object.entries() 相反
8. String.trimStart() String.trimEnd() String.trim() // 去空格
9. BigInt let bigInt = 9007199254740992n; Number.MAX_SAFE_INTEGER
10. ?? 空值合并操作符
11. ?. 可选链 判断 undefined 和 null 的时候更加简洁
12. globalThis
13. ||= &&= ??=
14. Array.at() 返回某一位的元素
15. hasOwn 可以用于判断隐式原型是 null 的情况
