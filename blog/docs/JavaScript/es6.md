# ES6+

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
