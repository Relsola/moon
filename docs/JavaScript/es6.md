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

### 块级声明

## 代理和反射

```js
console.log(typeof Proxy); // function

const obj = {
  name: 'alice',
  showName() {
    console.log(`my name is ${this.name}`);
  }
};

// 增删改查
obj.age = 17;
console.log('age' in obj); // true
delete obj.age;

// 遍历对象的所有属性
console.log(Object.getOwnPropertyNames(obj)); // [ 'name', 'showName' ]
console.log(Object.getOwnPropertySymbols(obj)); // []
console.log(Object.keys(obj)); // [ 'name', 'showName' ]
for (const key in obj) console.log(key); // name showName

// 获取对象的某个属性的描述对象
console.log(Object.getOwnPropertyDescriptor(obj, 'name'));
// { value: 'alice', writable: true, enumerable: true, configurable: true }

// 使用Object身上的方法，为某个对象添加一个或多个属性
Object.defineProperty(obj, 'age', {
  value: 17,
  writable: true,
  enumerable: true,
  configurable: true
});

Object.defineProperties(obj, {
  showAge: {
    value: function () {
      console.log(`my age is ${this.age}`);
    },
    writable: true,
    enumerable: true,
    configurable: true
  },
  showInfo: {
    value: function () {
      console.log(`我叫${this.name}，今年${this.age}岁`);
    },
    writable: true,
    enumerable: true,
    configurable: true
  }
});
obj.showInfo(); // 我叫alice，今年17岁

// 获取一个对象的原型对象
Object.getPrototypeOf(obj);
console.log(Object.getPrototypeOf(obj) === obj.__proto__); // true

// 设置某个对象的原型属性对象
Object.setPrototypeOf(obj, null);

// 让一个对象变得不可扩展，即不能添加新的属性 查看一个对象是不是可扩展的
Object.preventExtensions(obj);
console.log(Object.isExtensible(obj)); // false

// 如果对象为function类型，function类型的对象可以执行被执行符号()以及.call()和.apply()执行
function fn(...args) {
  console.log(this, args);
}
fn(1, 2, 3);
fn.call(obj, 1, 2, 3);
fn.apply(obj, [1, 2, 3]);

// 一切皆是对象。如果对象作为构造函数时，则该对象可以用new生成出新的对象
function Person() {}
let p1 = new Person();

// ---------------------------------------------------------------------

const person = { name: 'Alice' };

const proxy = new Proxy(person, {
  // 1. get方法 接受3个参数 target, propKey, receiver，
  // 要代理的目标对象 对象上的属性 代理对象
  // 该方法用于拦截某个属性的读取操作
  get: function (target, propKey, receiver) {
    console.log(proxy === receiver); // true
    if (propKey in target) return target[propKey];
    else throw new ReferenceError(`Prop name ${propKey} does not exist.`);
  },

  // 2. set方法 接受4个参数 target, propKey, value, receiver
  // 要代理的目标对象 对象上的属性 属性对应的值 代理对象
  // 该方法用于拦截对象属性操作
  set: function (target, propKey, value, receiver) {
    console.log(`设置 ${target} 的${propKey} 属性，值为${value}`);
    target[propKey] = value;
  },

  // 3. has方法 接受 target, propKey
  // 用于拦截 propKey in proxy的操作
  // 返回一个布尔值，表示属性是否存在
  has: function (target, propKey) {
    return propKey in target;
  },

  // 4. deleteProperty方法 可接收target, propKey，
  // 用于拦截delete操作，
  // 返回一个布尔值，表示是否删除成功
  deleteProperty(target, propKey) {
    return delete target[propKey];
  },

  /* 
       5. ownKeys方法
          接收target
          用于拦截Object.getOwnPropertyNames(proxy)、Object.getOwnPropertySymbols(proxy)、Object.keys(proxy)、for...in循环等类似操作
          返回一个数组，表示对象所拥有的keys
    */
  ownKeys(target) {
    return Object.getOwnPropertyNames(target); // 为了省事
  },

  /* 
       6. getOwnPropertyDescriptor方法 
          接收target和propKey，
          用于拦截 Object.getOwnPropertyDescriptor(proxy, propKey)
          返回属性的描述对象
    */
  getOwnPropertyDescriptor(target, propKey) {
    return Object.getOwnPropertyDescriptor(target, propKey);
  },

  /* 
       7. defineProperty方法
          接收target, propKey, propDesc，
          目标对象、目标对象的属性，以及属性描述配置
          用于拦截 Object.defineProperty() 和 Object.defineProperties()
    */
  defineProperty(target, propKey, propKeyPropDesc) {
    return Object.defineProperty(target, propKey, propKeyPropDesc);
  },

  /* 
       8. preventExtensions 方法 
         可接收target
         用于拦截 Object.preventExtensions(proxy)操作
    */
  preventExtensions(target) {
    return Object.preventExtensions(target);
  },

  /* 
       9. getPrototypeOf(target) 
          在使用Object.getPrototypeOf(proxy)会触发调用
          返回一个对象
    */
  getPrototypeOf(target) {
    return Object.getPrototypeOf(target);
  },

  /* 
      10. isExtensible(target) 
          当使用Object.isExtensible(proxy)时会触发调用
          返回一个布尔值，表示是否可扩展
    */
  isExtensible(target) {
    return Object.isExtensible(target);
  },

  /* 
      11. setPrototypeOf(target, proto) 
          当调用Object.setPrototypeOf(proxy, proto)会触发该函数调用
    */
  setPrototypeOf(target, proto) {
    console.log(`设置${target}的原型为${proto}`);
    return Object.setPrototypeOf(target, proto);
  },

  /* 
      12. apply(target, object, args)
      接收三个参数 target, object, args
      目标对象 调用函数是的this指向 参数列表
      当Proxy实例作为函数调用时触发
      比如proxy(...args)、proxy.call(object, ...args)、proxy.apply(...)
    */
  apply(target, object, args) {
    console.log(`调用了f`);
    return target.call(object, ...args);
  },

  /* 
       13. construct(target, args) 
          接收target和args，
          目标函数  参数列表
          当 Proxy 实例作为构造函数时触发该函数调用
          比如new proxy(...args)
    */
  construct(target, args) {
    console.log(`调用了construct`);
    return new target(...args);
  }
});

function Proxy(target, handler) {
  //...
}

/* 
   总结：
      1. 代理对象不等于目标对象，他是目标对象的包装品
      2. 目标对象既可以直接操作，也可以被代理对象操作，且两者相互关联
      3. 如果直接操作目标对象，则会绕过代理定义的各种拦截行为
      4. 如果用了代理，那肯定是希望给对象的操作嵌入我们定义的特殊行为，所以一般就操作代理对象就好

*/
```

## 对象拓展

1. 当属性名和属性保持一致的时候，可以简写
2. `Object.defineProperty` 定义属性
3. `Object.assign` 方法用来将源对象中所有可枚举的属性赋值到目标对象

```js
Object.defineProperty('对象', '属性', {
  value: '张三',
  enumerable: false, // 是否能被枚举
  writable: false, // 是否可写
  get() {
    console.log('get...');
  },
  set() {
    console.log('set...');
  }
});
```

## 箭头函数

1. 当我们的箭头函数只有一行代码的时候 `{}` 可以省略
2. 当我们的箭头函数只有一行 return 的时候 return 可以省略
3. 当我们只有一个参数的时候 ()可以省略
4. 如果我们返回值是对象的话 对象需要使用 () 进行一个包裹 `() => ({})`
5. 箭头函数是没有 this 的 他的 this 是当时的变量 this 遵循作用域往上找
6. 箭头函数中的 this 不会被改变
7. 箭头函数不能用作构造器
8. class 中的 constructor 不能用箭头函数
9. 箭头函数没有原型对象(没有显示原型，有隐士原型)
10. 给原型对象添加方法的时候，不推荐去使用箭头函数

## 解构赋值

```js
// 数组解构赋值
let [a, b] = [1, 2];

// 对象解构赋值
let obj = {
  say: function () {
    console.log('say...');
  },
  fn: function () {
    console.log('fn...');
  },
  tn: function () {
    console.log('tn...');
  }
};
let { fn, tn: bn } = obj;
fn();
bn();

// 函数参数结构
({ item }) => item;
```

## 展开运算符

`...` 展开运算符 也叫拓展运算符  
当你想定义一个函数 但是参数个数不确定的时 可以使用 `arguments`  
在 ES6+ 中可以使用 rest 运算符，将我们所有参数收集到 `arg` 中  
如果用 rest 运算符的话 那么 `...arg` 后面不能再写接收变量  
`Array.concat() `拼接数组  
`Array.from()` 将伪数组转换成真数组

## Proxy 代理

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