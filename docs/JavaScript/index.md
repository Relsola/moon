# JavaScript 知识笔记

## 对 JS 的理解

- `JavaScript` 是动态类型语言，代码在执行过程中，才知道这个变量属于的类型。
- 弱类型，数据类型不固定，可以随时改变。
- 解释型，一边执行，一边编译，不需要程序在运行之前整体先编译。
- 基于对象，最终所有对象都指向 `Object`。
- 脚本语言，一般都是可以嵌在其它编程语言当中执行。
- 单线程，依次执行，前面代码执行完后面才执行。

## JS 的数据类型

### 原始类型

JavaScript 中原始类型有六种，原始类型既只保存原始值，是没有函数可以调用的类型。  
`string` `number` `boolean` `null` `undefined` `symbol`

::: tip 原始类型的函数调用
原始类型调用函数方法时会被封装成其对应的对象  
`1'.toString()` 相当于 `new String('1').toString()`  
`new String('1')` 创建的是一个对象，而这个对象里是存在 `toString()` 方法的
:::

::: tip `null`、`undefined`、`undeclared` 的区别
`null` 表示空，什么都没有，不存在的对象，他的数据类型是 `object`。  
初始值赋值为 `null`，表示将要赋值为对象， 不再使用的值设为 `null`，浏览器会自动回收。

`undefined` 表示未定义，常见的为 `undefined` 情况：

1. 变量声明未赋值
2. 函数执行但没有明确的返回值
3. 获取一个对象上不存在的属性或方法。

变量声明未赋值，是 `undefined`，未声明的变量，是 `undeclared`，程序运行会报错。

:::

::: tip `null` 到底是什么类型
现在很多书籍把 null 解释成空对象，是一个对象类型。然而在早期 JavaScript 的版本中使用的是 32 位系统，考虑性能问题，使用低位存储变量的类型信息，000 开头代表对象，而 null 就代表全零，所以将它错误的判断成 Object，虽然后期内部判断代码已经改变，但 null 类型为 object 的判断却保留了下来，至于 null 具体是什么类型，属于仁者见仁智者见智，你说它是一个 bug 也好，说它是空对象，是对象类型也能理解的通。
:::

### 对象类型

在 JavaScript 中，除了原始类型，其它的都是对象类型  
对象类型存储的是地址，而原始类型存储的是值。

```js
const a = [];
const b = a;
a.push(1);
console.log(b); // [1]
```

基本数据类型存储在栈中，引用数据类型存储在堆中。  
引用数据类型在栈中存储了指针，该指针指向堆中该实体的起始地址。  
当解释器寻找引用值时，会首先检索其在栈中的地址，取得地址后从堆中获得实体。

### 判断数据类型

1. `typeof`

> typeof 的返回值有八种，返回值是字符串，不能判断数组和 null 的数据类型

```js
typeof ''; // string
typeof 1; // number
typeof true; // boolean
typeof undefined; // undefined
typeof Symbol(); // symbol
typeof 1n; // bigint
typeof new Function(); // function
typeof {}; // object

typeof null; // object 无效, 这个是一个设计缺陷，造成的
typeof []; // object 无效
```

2. `instanceof`

> instanceof 检查对象原型链上有没有该构造函数, 可以精准判断引用数据类型

```js
({}) instanceof Object; //true
new Date() instanceof Date; //true
new RegExp() instanceof RegExp; //true
new Error() instanceof Error; //true

[] instanceof Array; //true
[] instanceof Object; //true

(() => {}) instanceof Function; // true
(() => {}) instanceof Object; // true
```

3. `constructor`

> constructor 访问它的构造函数检测基本类型和对象, 但不能检测 null 和 undefined  
> 注意函数原的型可以进行重写, 导致 constructor 是不稳定的

```js
(10).constructor === Number; // true
[].constructor === Array; // true
new RegExp().constructor === RegExp; // true
new RegExp().constructor === Object; // false

function Fn() {}
Fn.prototype = new Array();
new Fn().constructor; // [Function: Array]
(() => {}).constructor; // [Function: Function]
```

4. `Object.prototype.toString.call`

> 让 Object 原型上的 toString 方法中的 this 指向第一个参数的值并执行, 是最准确的方式

```js
Object.prototype.toString.call(''); // [object String]
Object.prototype.toString.call(1); // [object Number]
Object.prototype.toString.call(true); // [object Boolean]
Object.prototype.toString.call(undefined); // [object Undefined]
Object.prototype.toString.call(null); // [object Null]
Object.prototype.toString.call(new Function()); // [object Function]
Object.prototype.toString.call(new Date()); // [object Date]
Object.prototype.toString.call([]); // [object Array]
Object.prototype.toString.call(new RegExp()); // [object RegExp]
Object.prototype.toString.call(new Error()); // [object Error]
```

### 类型转换

JavaScript 中，类型转换只有三种：

1. 转换成数字
2. 转换成布尔值
3. 转换成字符串

> 经典类型面试题

```js
console.log([] == ![]); // true
```

代码分析：

1. 左侧是一个对象(数组)
2. 右侧是一个布尔值，对象`[]`转换成布尔值 `true`，因为除了 `null` 所有对象都转换成布尔值，所以`![]`结果为 `false`
3. 此时相当于`对象==布尔值`，依据类型转换规则，转换成数字类型进行比较
4. 对象(空数组)转换成 `0`，布尔值 `false` 转换成 `0`
5. 即 `0==0`，返回 `true`

类型转换规则:

![JavaScript 类型转换](/image/JavaScript/type-conversion.png)

### `0.1 + 0.2 !== 0.3`

```js
console.log(0.1 + 0.2 === 0.3); // false
```

计算机是通过二进制的方式存储数据的  
所以计算机计算 0.1 + 0.2 的时候，实际上是计算的两个数的二进制的和  
0.1 的二进制是 0.0001100110011001100...（1100 循环）  
0.2 的二进制是 0.00110011001100...（1100 循环）  
这两个数的二进制都是无限循环的数  
在 JavaScript 中只有一种数字类型 Number  
它的实现遵循 IEEE 754 标准，使用 64 位固定长度来表示，也就是标准的 double 双精度浮点数  
在二进制科学表示法中，双精度浮点数的小数部分最多只能保留 52 位  
再加上前面的 1，其实就是保留 53 位有效数字，剩余的需要舍去，遵从"0 舍 1 入"的原则  
根据这个原则，0.1 和 0.2 的二进制数相加，再转化为十进制数就是：0.30000000000000004

## 函数

### 匿名函数

没有名字，在定义时执行，且执行一次，不存在预解析（函数内部执行的时候会发生）。

匿名函数的作用有：

1. 对项目的初始化，页面加载时调用，保证页面有效的写入 Js，不会造成全局变量污染
2. 防止外部命名空间污染
3. 隐藏内部代码暴露接口

立即执行函数形式：

1. `(function(){})()`
2. `;(function (){})()`
3. `;(function (){}())`
4. `+function (){}()`
5. `-function (){}()`
6. `!function (){}()`

```js
(function () {})();

(function () {})();

// 使用多种运算符开头，一般是用!
!(function () {})();
```

### 回调函数

一段可执行的代码段，它作为一个参数传递给其他的代码，其作用是在需要的调用这段回调函数。

例点击事件的回调函数，异步请求的回调函数，计时器等。

```js
setTimeout(function () {
  console.log('hello');
}, 1000);
```

### 构造函数

在 ES6 之前，我们都是通过构造函数创建类，从而生成对象实例
构造函数就是一个函数，只不过通常我们把构造函数的名字写成大驼峰
构造函数通过 new 关键字进行调用，普通函数直接调用。

```js
// 创建一个类（函数）
function Person(name, age) {
  this.name = name;
  this.age = age;
  this.eat = function () {
    console.log('我爱吃');
  };
}
// 普通函数调用
const result = Person('张三', 18);
console.log(result);

// 构造函数调用
const p = new Person('李四', 16);
console.log(p);
```

### 函数中 `arguments` 的对象

函数在调用时 JS 引擎会向函数中传递两个的隐含参数  
一个是 `this`，另一个是 `arguments`  
`arguments` 是一个伪数组，用于获取函数中在调用时传入的实参。

```js
function add() {
  console.log(Array.isArray(arguments));
}
```

## 原型和原型链

继承是 OO 语言中的一个最为人津津乐道的概念。许多 OO 语言都支持两种继承方式: `接口继承` 和 `实现继承`。接口继承只继承方法签名，而实现继承则继承实际的方法。由于 js 中方法没有签名，在 ECMAScript 中无法实现接口继承。ECMAScript 只支持实现继承，而且其 `实现继承` 主要是依靠原型链来实现的。

### 构造函数、原型和实例的关系

1. 每个构造函数(`constructor`)都有一个原型对象(`prototype`)，原型对象都包含一个指向构造函数的指针(`constructor`),而实例都包含一个指向原型对象的内部指针(`__proto__`)。

2. 如果试图引用对象(实例 `instance`)的某个属性,会首先在对象内部寻找该属性，直至找不到，然后才在该对象的原型(`instance.prototype`)里去找这个属性。

如果让原型对象指向另一个类型的实例，即: `constructor1.prototype = instance2`，如果试图引用 `constructor1` 构造的实例 `instance1` 的某个属性 `p1`：

1. 首先会在 `instance1` 内部属性中找一遍
2. 接着会在 `instance1.__proto__` (`constructor1.prototype`) 中找一遍，而 `constructor1.prototype` 实际上是 `instance2`，也就是说在 `instance2` 中寻找该属性 `p1`
3. 如果 `instance2` 中还是没有,此时程序不会灰心，它会继续在 `instance2.__proto__`(`constructor2.prototype`)中寻找...直至 `Object` 的原型对象，如果依然没有找到，则返回 `undefined`。

> 搜索轨迹: instance1--> instance2 --> constructor2.prototype…-->Object.prototype

```js
function Father() {
  this.property = true;
}
Father.prototype.getFatherValue = function () {
  return this.property;
};
function Son() {
  this.sonProperty = false;
}
// 继承 Father
// Son.prototype 被重写,导致 Son.prototype.constructor 也一同被重写
Son.prototype = new Father();
Son.prototype.getSonValue = function () {
  return this.sonProperty;
};
const instance = new Son();
console.log(instance.getFatherValue()); //true
```

这里借用下图解示例：

![JavaScript 原型链](/image/JavaScript/prototype.png)

### 确定原型和实例的关系

1. 使用 `instanceof` 操作符

```js
console.log(instance instanceof Object); // true
console.log(instance instanceof Father); // true
console.log(instance instanceof Son); // true
```

2. 使用 `isPrototypeOf()` 方法

> `__proto__` 已经废弃了，现在使用 `Object.getPrototypeOf()` 获取

```js
console.log(Object.prototype.isPrototypeOf(instance)); // true
console.log(Father.prototype.isPrototypeOf(instance)); // true
console.log(Son.prototype.isPrototypeOf(instance)); // true
```

### 原型链的问题

1. 当原型链中包含引用类型值的原型时,该引用类型值会被所有实例共享

2. 在创建子类型(例如创建 Son 的实例)时,不能向超类型(例如 Father)的构造函数中传递参数

### 借用构造函数

为解决原型链中上述两个问题, 我们开始使用一种叫做借用构造函数(constructor stealing)的技术(也叫经典继承).

> 基本思想:即在子类型构造函数的内部调用超类型构造函数.

```js
function Father() {
  this.colors = ['red', 'blue', 'green'];
}
function Son() {
  Father.call(this); // 继承了Father,且向父类型传递参数
}

const instance1 = new Son();
instance1.colors.push('black');
console.log(instance1.colors); // "red,blue,green,black"

const instance2 = new Son();
console.log(instance2.colors); // "red,blue,green"
```

## BOM

### URL 的组成

- `https://www.baidu.com:443/admin?name="wang"#abc`
- `https://` 协议
- `www.baidu.com` host 主机地址 通过主机地址去找 ip 地址
- `:443` https 默认的端口号 http 默认的是 80 端口
- `/admin` 路径名 path
- `?name="wang"` search 查询字符串
- `#abc` hash 值 锚点

### BOM 浏览器对象模型

将浏览器看做是一个对象，定义了与浏览器进行交互的方法和接口，通过 JS 操作浏览器。  
`window` 对象是 BOM 的顶级对象，称作浏览器窗口对象  
全局变量会成为 `window` 对象的属性，全局函数会成为 `window` 对象的方法

```js
// 打开关闭窗口
const win = window.open('https://www.baidu.com') / win.close();

// outerHeight 整个浏览器的高度 innerHeight 窗口内容区的高度 不包含边框和菜单栏
window.outerHeight / window.innerHeight;

// Location对象 提供了url相关的属性和方法

// 返回当前加载页面的完整URL
location.href;

// protocol 返回页面使用的协议
location.protocol;

// 返回URL的查询字符串，查询?开头的的字符串
location.search;

// assign  打开一个新的URL 一个新窗口  有记录可以返回
location.assign('https://www.baidu.com');

// replace 替换 打开一个新的url同时替换掉原本网页 不会留下记录  不能返回
location.replace('https://www.baidu.com');

// reload 重新加载页面 强制刷新 会清除缓存
location.reload(true);

// history对象 允许我们访问浏览器曾经的历史会话记录

// 去到指定页面 传参数去到指定的页面
history.go(1);

// forward 只能去到下一页 不能传参数
history.forward();

// 回到上一页
history.back();

// navigator 提供了浏览器相关的信息，比如浏览器的名称、版本、语言、系统平台等信息
navigator;

// screen 主要记录浏览器窗口外面的客户端显示器的信息
screen.width / screen.height;

//sessionStorage 浏览器中有一部分储存空间 用来存储数据 临时存储
sessionStorage.setItem();
sessionStorage.getItem();
sessionStorage.removeItem();

// localStorage 不会随着页面关闭而清空，持久化存储
localStorage.setItem();
localStorage.getItem();
localStorage.removeItem();
```

## DOM

### 获取节点

```js
// document 是一个对象 挂载在 window 对象上
window.document;

// 第一个子节点
document.body.firstChild;

// 选择节点后面的一个兄弟节点
document.body.nextSibling;

// 拿到父节点
document.body.parentNode;

// 拿到第一个 元素 子节点
document.body.firstElementChild;

// 拿到下一个 元素 子节点
document.body.nextElementSibling;

// 获取子节点(伪数组)
document.body.children;

// body下面的所有子节点  包含了注释 换行 文本...
document.body.childNodes;

// 获取节点类型 元素节点类型是 1 注释节点的类型是8 文本节点的类型是3
document.body.nodeType; // 1

// 获取节点名字
document.body.nodeName; // #comment #text DIV

// TagName 获取标签元素的名字 只有元素标签才可以获取到名字
document.body.tagName; //  DIV(大写) / undefined

innerHTML; // 可以获取到元素内部的内容，可以解析 HTML 标签
outerHTML; // outerHTML 包含元素自身 innerHTML 只能获取子元素不包括自身
textContent; // 只能识别文本
nodeValue; // 用于获取非元素节点的文本内容
document.body.hidden = true; // 隐藏
```

### 节点的创建和挂载

```js
// 创建节点 document.write() innerHTML createElement();

// 创建一个元素
const h1 = document.createElement('span');

// 挂载元素
// 把创建好的span元素挂载到father元素里
father.append(h1); // 挂载在father节点内部的尾部
father.prepend(h1); // 挂载在father节点内部的头部

//同一个元素只能挂载一次，后面的会覆盖掉前面的
father.before(h1); // 挂载在father节点外部的头部
father.after(h1); // 挂载在father节点外部的尾部

appendChild();

// 操作节点
removeChild(); // 删除子元素
remove(); // 删除元素自己

replaceChild(); // 替换节点

cloneNode(false); // 浅克隆，只克隆当前元素，不克隆子元素
cloneNode(true); // 深克隆，克隆当前元素及其子元素

hasAttribute(); // 检测这个元素上满有没有这个属性 返回布尔值
getAttribute(); // 通过属性名来获取属性值
setAttribute(); // 设置属性值
removeAttribute(); // 删除属性
attributes; // 得到元素身上的所有属性 是一个对象
// 特殊情况 在input中，property和attribute不相通 input里面使用property
```

### 获取元素

```js
// id选择器
document.getElementById('1');

// 标签名选择器  得到一个伪数组 可以通过索引获取我们想要的元素
document.getElementsByTagName('div');

// 通过类名获取元素
document.getElementsByClassName('item');

// 通过选择器来选择元素
document.querySelector('#box1'); // 只能找到第一个元素
document.querySelectorAll('ul li'); // 获取所有符合条件的元素 是一个伪数组
```

### 操作样式

```js
// 动态修改class

classList.add(); // 添加一个类名
classList.remove(); // 删除一个类名
classList.toggle(); // 类名存在就删除，不存在就添加
classList.contains(); // 检查类名是否存在 返回布尔值

// 动态修改样式
const box = document.getElementById('box');
box.style.color = '#823345';
box.style.fontSize = '22px';
box.style.opacity = '.1';

// 只有行内样式可以通过style.xxx找到
getComputedStyle(); // 全局函数可以获取到style标签里面的样式和外部引入的样式
```

### DOM 事件

```js
// 鼠标事件

('click'); // 鼠标单击事件

('dblclick'); // 鼠标双击事件

('mouseup'); // 鼠标抬起事件

('mousedown'); // 鼠标按下事件

('mouseover'); // 鼠标移入事件

('mouseout'); // 鼠标移出事件

('mousemove'); // 鼠标在元素上移动

('contextmenu'); // 鼠标右键触发的事件

// 键盘事件

('keydown'); // 键盘按下事件

('onkeyup'); // 键盘抬起事件

('keypress'); // 键盘抬入事件

// keydown按任意键都可以触发 keypress shift ctrl alt  Tab都不会触发

// 其他事件

('onload'); // 加载事件 当我们网页所有资源加载完毕时，会触发load事件

('DOMcontentLoaded'); // 当页面元素加载完毕触发，不会等外部加载

('focus'); // 获取焦点

('blur'); // 失去焦点

('change'); // 内容发生改变且失去焦点

('input'); // 内容发生改变但没有失去焦点

('submit'); // 提交按钮只能在表单中，所以需要通过表单触发 事件源必须是一个form

('reset'); // 重置按钮，默认事件是清空表单

('scroll'); // 窗口滚动事件

('resize'); // 当浏览器窗口大小改变时触发

// DOM2级别事件 事件监听器  事件池 可以多次绑定，不会覆盖掉 推荐
but.addEventListener('事件', 回调函数); // 添加
but.removeEventListener('事件', 回调函数); // 移除

// html级别的事件， 写在标签内
<button onclick="fn()">点击</button>;

//  DOM0级别事件 重复绑定会覆盖掉 优先级高于html事件绑定
btn.onclick = function () {
  console.log('onclick..');
};

// DOM0的事件解绑
btn.onclick = null;
```

### 事件对象

- 事件冒泡:从内到外触发事件，由子集向父级传播
- 事件捕获：从外到内 由父级向子集传播

如果事件捕获和冒泡同时存在，先捕获，再冒泡  
事件委托就是利用事件冒泡，指定一个事件处理程序，就可以管理某一类型的所有事件  
如果子元素有很多，且子元素的事件监听逻辑都相同，将事件监听绑定到父元素身上或者共有的祖先元素上  
事件委托原理是利用事件冒泡，子元素触发，父元素执行回调函数

好处：

1. 减少事件的绑定次数
2. 新增元素不需要单独绑定

```js
// 事件对象常用属性
target; // 事件绑定的元素

currentTarget; // 触发事件的元素，两者没有冒泡的情况下，是一样的值，但在使用了事件委托的情况下，就不一样了。

preventDefault(); // 阻止默认行为，比如阻止超链接跳转、在form中按回车会自动提交表单。

stopPropagation(); // 阻止冒泡传播
```

### 元素视宽高

```js
// client家族 只能获取 不能设置 不能改变

// 获取盒子的 宽度 + 左右padding
clientWidth;

// 获取盒子的 高度 + 上下padding
clientHeight;

// 获取盒子的上边框宽度
clientTop;

// 获取盒子的左边框宽度
clientLeft;

// 当前页面的宽度 可以获取浏览器当前页面的宽度
document.body.clientWidth;

// 当前页面的高度 可以获取浏览器当前页面的高度
document.body.clientHeight;

//获取一屏的宽度和高度
document.documentElement.clientWidth;
document.documentElement.clientHeight;

// offset家族 获取元素相对于父级元素的偏移量

// 盒子 + padding + border 的长和高
offsetWidth / offsetHeight;

// 相对于父元素左侧的偏移量
offsetLeft;

// 相对于父元素顶部的偏移量
offsetTop;

// 获取盒子定位的参考点
offsetParent;

// scroll家族 获取盒子可以滚动的高度

// scrollHeight获取到的是真实的内容高度
scrollHeight;

// 获取被卷上去的高度 可以设置
scrollTop;

// 获取的是html标签卷上去的高度
// 一个元素可以滚动的最大高度怎么计算？真实盒子的真实内容高度-当前父盒子的高度
document.documentElement.scrollTop;
```

## AJAX

### 原生 AJAX

```js
// 1. 创建一个请求对象(xhr对象)
const xhr = new XMLHttpRequest();

// 设置响应的是json类型的 此时后端响应回来的即使是json字符串也会转成对象
xhr.responseType = 'json';

// 2. 监听变化（一个请求从创建到发送 有四种状态）
xhr.onreadystatechange = function () {
  console.log(xhr.response); // 响应体
  console.log(xhr.readyState); // HTTP 请求的状态。
  // 如果后端响应的是xml类型 那么dom对象在 responseXML 中
  console.log(xhr.responseXML);
};

// onload 事件 这个事件会等你在请求调用完成后直接执行
xhr.onload = function () {
  console.log(xhr.response);
};

// 3. 配置网络请求
xhr.open('post', 'http://....');

// 使用post请求传参 需要设置请求头
// Content-Type 默认值是text/plain
// 你需要告诉服务器 你传递的是什么类型
xhr.setRequestHeader('Content-Type', 'application/json');

// 4. 发送请求
xhr.send(JSON.stringify(obj));
```

### 拓展

1. `status` 由服务器返回的 HTTP 状态代码
2. `statusText` 这个属性用名称而不是数字指定了请求的 HTTP 的状态代码
3. `timeout` 超时时间，毫秒数
4. `abort()` 取消当前响应，关闭连接并且结束任何未决的网络活动
5. `getAllResponseHeaders()` 把 HTTP 响应头部作为未解析的字符串返回
6. `getResponseHeader()` 返回指定的 HTTP 响应头部的值

### 事件监听

1.  `progress` 加载进度
2.  `load` 请求完成并接受到服务器返回结果
3.  `error` 请求错误
4.  `abort` 终止请求

### FromData 对象

FormData 对象的方法

1. `get(key)` 与 `getAll(key)` 获取相对应的值
2. `append(key,value)` 在数据末尾追加数据
3. `set(key, value)` 设置修改数据
4. `has(key)` 判断是否存在对应的 key 值
5. `delete(key)` 删除数据
6. `entries()` 获取一个迭代器，然后遍历所有的数据

```html
<form action="" id="info">
  <input type="text" name="username" />
</form>
```

```js
// 一、将form表单作为参数 直接传入
function getInfo() {
  const xhr = new XMLHttpRequest();
  const fromEle = document.querySelector('#info');

  xhr.responseType = 'json';
  xhr.onload = function () {
    console.log(xhr.response);
  };

  xhr.open('post', 'http://....');
  xhr.setRequestHeader('Content-Type', 'application/json');

  const fromData = new FormData(fromEle);
  xhr.send(fromData);
}

// 二、通过容器.append往里面塞数据
function getInfo() {
  const xhr = new XMLHttpRequest();
  const fromData = new FormData();

  xhr.responseType = 'json';
  xhr.onload = () => {
    console.log(xhr.response);
  };
  xhr.open('post', 'http://...');
  xhr.setRequestHeader('Content-Type', 'application/json');

  fromData.append('name', 'Jack');
  xhr.send(fromData);
}
```

### Axios

```js
// 一、基本使用
axios({ method: 'POST/GET', url: '...' }).then(result => {
  console.log(result);
});

// 二、请求传参
const url = 'http://...';
axios.get(url, { params: { id: 1 } }).then(result => {
  console.log(result);
});

axios.post(url, { id: 1 }).then(result => {
  console.log(result);
});

// 三、创建axios实例  --------------------------------------
const request = axios.create({
  baseURL: url,
  timeout: 5000,
  headers: {}
});

request.get('/get').then(result => {
  console.log(result);
});

request({
  method: 'get',
  url: '/get',
  params
}).then(result => {
  console.log(result);
});

request({
  method: 'post',
  url: '/post',
  data
}).then(result => {
  console.log(result);
});

// 响应请求拦截器 -----------------------------------------------
axios.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    console.log('请求出去了');
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    if (response.status == 200) {
      console.log('响应回来了');
      return response.data;
    } else {
      return '请求有误';
    }
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    console.log('请求有误');
    return Promise.reject(error);
  }
);
```

## console

1. `console.table`

> console.table 把数据以表格的形式打印出来 对象会枚举

```js
const data = [
  ['name', 'Tom'],
  ['age', 18],
  ['gander', '男']
];
console.table(data);
```

2. `console.dir` / `console.dirxml`

> console.dir 在控制台中查看指定 JavaScript 对象的所有属性  
> console.dirxml 显示一个明确的 XML/HTML 元素的包括所有后代元素的交互树

```js
console.dir(document);
console.dirxml(document);
```

3. `console.warn` / `console.error`

> 向控制台输出一条 错误 / 警号 消息

```js
console.warn('this is a warn message');
console.error('this is a error message');
```

4. `console.time` / `console.timeLog` / `console.timeEnd`

> 测量程序中某一特定操作所需的时间

```js
const data = Array.from({ length: 100 }, (_, k) => k);

console.time('for of');
let i = 0;
for (; i < 1000; i++) for (const _ of data);
console.timeLog('for of');
for (; i < 1000000; i++) for (const _ of data);
console.timeEnd('for of');

console.time('forEach');
i = 0;
for (; i < 1000; i++) data.forEach(() => {});
console.timeLog('forEach');
for (; i < 1000000; i++) data.forEach(() => {});
console.timeEnd('forEach');
```

5. `console.trace`

> 在调用它的位置输出当前堆栈跟踪

```js
const a = () => b();
const b = () => (() => c())();
const c = () => console.trace();
a();
```

6. `console.assert`

> 如果断言为 false，则将一个错误消息写入控制台, 如果断言是 true，没有任何反应

```js
const num = 13;
console.assert(num > 10, 'Number must be greater than 10');
console.assert(num > 20, 'Number must be greater than 20');
```

7. `console.count` / `console.countReset`

> console.count 记录调用 count(label) 的次数 不传值默认 'default'  
> console.countReset 重置 count(label) 计数器

```js
for (let i = 0, str = 'div'; i <= 4; i++) {
  i === 2 ? console.countReset(str) : console.count(str);
}
```

8. `console.log` / `console.info` / `console.debug`

> 都是让控制台输出消息,几乎没什么不同,用 console.log 就行

```js
console.log('log');
console.info('info');
console.debug('debug');
```

> console.log 支持占位符
>
> - 字符串：`%s`
> - 整数：`%d`
> - 浮点数：`%f`
> - 对象：`%o` 或 `%O`
> - CSS 样式：`%c`

```js
// %c 指令前的文本不会受到影响，但指令后的文本将会使用参数中声明的 CSS 样式
// 如果输出的文本里面希望包含 "%c" 这个字符，可以使用 "%%c" 的方式进行转义
console.log(
  `%c vue-devtools %c Detected Vue v2.6.11 %c`,
  'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
  'background:#41b883 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff',
  'background:transparent'
);
```

9. `console.group` / `console.groupCollapsed` / `console.groupEnd`

> 接收一个参数 label 分组标签 缩进 折叠 回退缩进

```js
console.groupCollapsed('label');
console.group('Lv1');
console.group('Lv2');
console.log('⭐');
console.groupEnd();
console.log('⭐⭐⭐');
console.groupEnd();
console.log('⭐⭐⭐⭐⭐');
console.groupEnd();
console.groupEnd();
console.log('⭐⭐⭐⭐⭐⭐⭐');
```

10. `console.profile` / `console.profileEnd`

> 记录性能描述信息 有兼容性等各种问题

```js
// 启动性能分析
console.profile('profileName');
// ...执行操作;
// 停止性能分析
console.profileEnd('profileName');
```

11. `console.memory`

> console 对象的一个属性 用来查看当前内存的使用情况

```js
console.log(console.memory);
```

12. `console.clear`

> 清空控制台

```js
console.clear();
```

## 高级

### 作用域链和变量提升

作用域就是变量起作用的范围和区域，作用域的目的是隔离变量，保证不同作用域下同名变量不会冲突。

JS 中，作用域分为三种，全局作用域、函数作用域和块级作用域。  
全局作用域在 `script` 标签对中，无论在哪都能访问到。  
在函数内部定义的变量，拥有函数作用域。  
块级作用域则是使用 `let` 和 `const` 声明的变量，如果被一个大括号括住，那么这个大括号括住的变量区域就形成了一个块级作用域。

作用域层层嵌套，形成的关系叫做作用域链，作用域链也就是查找变量的过程:  
当前作用域 -> 上一级作用域 -> 上一级作用域 .... -> 直到找到全局作用域 -> 还没有，则会报错。  
作用域链是用来保证变量和函数在执行环境中有序访问。

### 闭包：

- 一个本该被销毁的变量内存空间 ，由于外部的引用导致其无法被销毁，那么他就会形成闭包
- 延长了变量的生命周期 扩大了变量的作用范围 保护了变量
- 但会造成内存泄露
- 节流、防抖就是利用了闭包
- 常见应用：
- 模拟私有变量 柯里化 偏函数 防抖 节流
- 常见的内存泄漏：
- 全局变量 遗忘清理的计时器 遗忘清理的 dom 元素引用

### 垃圾回收:

- 引用计数法:
- 当我们创建一个变量，对应的也就创建了一个针对这个值的引用。
- 在引用这块计数法的机制下，内存中每一个值都会对应一个引用计数
- 当垃圾收集器感知到某个值的引用计数为 0 时，就判断它“没用”了，随即这块内存就会被释放。
- 无法甄别循环引用场景下的“垃圾”

标记清除法

- 在标记清除算法中，一个变量是否被需要的判断标准，是它是否可抵达  。
- 这个算法有两个阶段，分别是标记阶段和清除阶段：
- 标记阶段：垃圾收集器会先找到根对象，在浏览器里，根对象是 Window；在 Node 里，根对象是 Global
- 从根对象出发，垃圾收集器会扫描所有可以通过根对象触及的变量，这些对象会被标记为“可抵达 ”。
- 清除阶段： 没有被标记为“可抵达” 的变量，就会被认为是不需要的变量，这波变量会被清除

- ob 2 进制 0o 8 进制 0x 16 进制 00 开头 8 进制

with 破化了作用域链  
with 作用是 扩大了放入数据的作用域  
当 with 传入的值非常复杂的时候 即使 obj 他是非常复杂的嵌套结果，with 也会让代码看起来简洁

```js
const obj = {
  name: '张三',
  stu: {
    names: 'one'
  }
};
let newname;
with (obj.stu) {
  newname = names;
}
console.log(newname);
```

### this 和 new

当一个函数被调用时，会创建一个执行上下文，其中 this 就是执行上下文的一个属性，this 是函数在调用时 JS 引擎向函数内部传递的一个隐含参数

this 指向完全是由它的调用位置决定，而不是声明位置。除箭头函数外，this 指向最后调用它的那个对象

1. 全局作用域中，无论是否严格模式都指向 window/global
2. 普通函数调用，指向 window/global，严格模式下指向 undefined
3. 对象方法使用，该方法所属对象
4. 构造函数调用，指向实例化对象
5. 匿名函数中，指向 window/global
6. 计时器中，指向 window/global
7. 事件绑定方法，指向事件源
8. 箭头函数指向其上下文中 this
9. call bind apply 取决于参数
10. 内置的高级函数 取决于参数

this 的绑定：

1. 默认绑定 当一个函数独立调用的时候 this 指向是 window/global
2. 隐式绑定 对于对象使用方法 this 隐式绑定该对象
3. 显示绑定 call bind apply
4. new 绑定 显示绑定优先级高于隐式绑定 new 优先级别高于隐式

call、apply、bind

1. call、apply 和 bind，都是用来改变 this 指向的，三者是属于大写  Function 原型上的方法，只要是函数都可以使用。
2. call 和 apply 的区别，体现在对入参的要求不同，call 的实参是一个一个传递，apply 的实参需要封装到一个数组中传递。
3. call、apply 相比 bind 方法，函数不会执行，所以我们需要定义一个变量去接收执行。

new 运算符 1.在构造器函数内部创建了一个对象 2.把构造器内部的 this 指向了这个对象 3.执行函数 4.返回了这个对象

返回值情况

1. 如果构造器函数返回的是基本数据类型，外边得到的是新创建的对象
2. 如果构造器函数返回的是引用数据类型，外边得到的是构造器函数返回值

私有属性和共有属性

1. 针对于类来说的 不是针对于对象来说
2. 私有是指 只能在构造器内部访问的属性

## 继承
