# JavaScript 知识笔记

> JavaScript 详细权威知识参考 MDN 文档

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
> console.log 支持占位符

```js
console.log('log');
console.info('info');
console.debug('debug');
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

## Proxy 代理

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

## 高级

### 作用域链和变量提升

代码段：

- 一个页面里面可以引入多个代码段
- 一个 script 标签就是一个代码段
- 代码段相互独立（代码的出错会阻塞当前代码段下面的代码执行）并不影响
- 靠前的代码段声明的变量后面的代码段可以使用
- 靠后的代码段声明的变量后面的代码段无法使用

作用域链：

- 一个变量的作用范围就是作用域
- 找不到变量的时候往外找 外指的是定义时的外面

预解析：

- 浏览器在执行 JS 代码的时候，会分成 2 部分进行操作，预编译和逐步执行代码
- 预编译：用 var 声明的变量会提升，用 function 声明的也会提升
- 提升是以函数为界限。提升不可能提升到函数外面

同步和异步：

- JS 代码分两种：同步代码 异步代码
- 同步代码就是我们正常书写的 从上往下依次执行的代码
- 异步代码：事件绑定 定时器 promise ajax
- 异步代码就是我们需要他执行的时候，他才执行
- 异步代码在同步代码之后执行

JS 中执行上下文

- 代码执行前，浏览器的 Js 引擎先会创建代码执行的环境来处理此 Js 代码的转换和执行，代码的执行环境称为执行上下文。
- 执行上下文是一个抽象概念，包含当前正在运行的代码以及帮助其执行的所有内容。
- 执行上下文主要分为三类： 1. 全局执行上下文 —— 全局代码所处的环境，不在函数内部代码都在全局执行。 2. 函数执行上下文 —— 在函数调用时创建的上下文。 3. Eval 执行上下文 —— 运行在 Eval 函数中代码时创建的环境，Eval 由于性能问题在我们平时开发中很少用到，所有这里我们不在讨论。
- 全局执行上下文： 1. 将 window 作为全局执行上下文对象 2. 创建 this，this 指向 window 3. 给变量和函数安排内存空间 4. 变量赋值 undefined，函数声明放入内存 5. 放入作用域链
  全局与函数执行上下文不同： 1. 全局：在文件执行前创建；函数：在函数调用时创建 2. 全局：只创建一次；函数：调用几次创建几次 3. 将 window 作为全局对象；函数：创建参数对象 arguments，this 指向调用者

闭包：

- 一个本该被销毁的变量内存空间 ，由于外部的引用导致其无法被销毁，那么他就会形成闭包
- 延长了变量的生命周期 扩大了变量的作用范围 保护了变量
- 但会造成内存泄露
- 节流、防抖就是利用了闭包
- 常见应用：
- 模拟私有变量 柯里化 偏函数 防抖 节流
- 常见的内存泄漏：
- 全局变量 遗忘清理的计时器 遗忘清理的 dom 元素引用

垃圾回收:

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

高阶函数：

- 当一个函数 如果它的参数是函数 或者它的返回值是函数 那么我们叫这个函数为高阶函数
- ob 2 进制 0o 8 进制 0x 16 进制 00 开头 8 进制
- 浏览器打印其他进制的数据时，会自动的帮你转换成 10 进制

### let 和 const

1. var 声明的变量预编译阶段会提升，不加 var 的不会提升
2. 不管加不加 var 全局变量都会挂载到 GO 上，也就是 window/global 上
3. 加 var 的既可以是全局变量，也可以是局部变量 不加 var 的是全局变量（第一次出现）
4. 局部变量不会挂载到 GO 上
5. 你在使用 var 的时候，声明提升到了最前面并且初始化值为 undefined
6. let 声明变量，在全局 let 就是全局变量，在局部 let 就是局部的，不会初始化（提升分两个阶段 1.把声明提升到代码的最前面 2.对变量的初始化）
7. let 和{}会形成块级作用域（块级作用域是 ES6 提出的概念）
8. 使用 let 声明的全局变量不会挂载到 GO 上
9. 使用 let 不能重复使用声明

使用 const 声明的是常量

1. 使用 const 声明的量不能修改(栈空间)
2. 使用 const 声明的量不会提升（实际上是不会初始化）
3. 使用 const 声明的量必须赋值
4. 使用 const 和{}也会形成块级作用域(暂存性死区)
5. const 声明的量也不会挂载到 GO 上

`in` 运算符就是看一个属性是否属于某个对象

if 和 function 连用的时候  
function 只会把声明提升到最外面 2.当你进入到 if 后，做的第一件事就是给 fn 赋函数体

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

立即执行函数：

- 第一种 `(function(){})()`
- 第二种 `;(function (){})()`
- 第三种 `;(function (){}())`
- 第四种 `+function (){}()`
- 第五种 `-function (){}()`
- 第六种 `!function (){}()`

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

### 构造器

```js
/* 
    构造器的本质式函数 构造器也叫类
    作用：统一的创建对象 ，创建出来的对象有共同的特点
*/

// 创建一个没有原型对象的对象
Object.create(null);

// 原型继承
{
  function Car(color) {
    this.tireNum = 4;
    this.color = color;
    say = function () {
      console.log('say..');
    };
  }

  function Tesla(color, energy) {
    this.tireNum = 4;
    this.color = color;
    this.energy = energy;
  }

  Tesla.prototype = new Car();
  Tesla.prototype.constructor = Tesla;
}

// call继承
{
  function father(name, age) {
    this.name = name;
    this.age = age;
  }
  function son(name, age, sex) {
    this.sex = sex;
    //this指向son1
    father.call(this, name, age);
    //改变this指向 执行函数
  }
  father.prototype.say = function () {
    console.log('say..');
  };
}

// 组合继承
{
  //组合继承就是把原型继承和call继承的核心代码都写一遍
  function father(name, age) {
    this.name = name;
    this, (age = age);
  }
  father.prototype.say = function () {
    console.log('say..');
  };

  function son(name, age, sex) {
    this.sex = sex;
    father.call(this, name, age);
  }

  //原型继承的核心就是把子类的原型对象换成父类的实例化对象
  son.prototype = new father();
  son.prototype.constructor = son;
  let son1 = new son('张三', 19, '男');
  console.log(son1);
  son1.say();
}

// 寄生继承
{
  function father(name, age) {
    this.name = name;
    this, (age = age);
  }
  father.prototype.say = function () {
    console.log('say..');
  };

  function son(name, age, sex) {
    this.sex = sex;
    father.call(this, name, age);
  }
  //利用Object.create创建一个新对象并且让其原型对象指向father的原型对象
  son.prototype = Object.create(father.prototype);
  son.prototype.constructor = son;
  let son1 = new son('张三', 19, '男');
  console.log(son1);
  son1.say();
}

// extends 继承
{
  class student {
    //在class声明的类中有一个函数叫constructor
    //他就是构造器函数
    constructor(name, age) {
      this.name = name;
      this.age = age;
      //私有
    }
    //共有的
    syaHello() {
      console.log('say..');
    }
  }
  let f1 = new student('张三', 18);
  console.log(f1);

  //想继承父类需要一个关键字 叫extends
  class son extends student {
    constructor(name, age, sex) {
      super(name, age);
      this.sex = sex;
    }
    sayGoodbye() {
      console.log('goodBye');
    }
  }
  let son1 = new son('向往', 18, '男');
  son1.syaHello();
  console.log(son1);
}
```

### 原型和原型链

- 一切都是对象
- 属性分共有和私有
- 每一个对象身上都有一个隐式原型**proto**
- 每一个构造器身上都有一个 prototype 显示原型
- 一个对象的隐式原型和其构造器对应的显示原型指向的是一样的
- 每一个原型对象都有一个叫 constructor 指向构造器

  为什么要有原型？

- 构造函数中的实例每调用一次方法，就会在内存中开辟一块空间，从而造成内存浪费
- 在函数对象中，有一个属性 prototype，它指向了一个对象，这个对象就是原型对象
- 这个对象的所有属性和方法，都会被构造函数所拥有
- 普通函数调用，prototype 没有任何作用
- 构造函数调用，该类所有实例有隐藏一个属性（proto）指向函数的 prototype
- 实例的隐式原型指向类的显示原型
- 原型就相当于一个公共区域，可以被类和该类的所有实例访问到

优点: 资源共享，节省内存；改变原型指向，实现继承  
缺点：查找数据的时候有的时候不是在自身对象中查找。

原型链:实际上是指隐式原型链,从对象的**proto**开始，连接所有的对象，就是对象查找属性或方法的过程。

1. 当访问一个对象属性时，先往实例化对象在自身中寻找，找到则是使用。
2. 找不到（通过*proto*属性）去它的原型对象中找，找到则是使用。
3. 没有找到再去原型对象的原型（Object 原型对象）中寻找，直到找到 Object 为止，如果依然没有找到，则返回 undefined。

### 错误和抛出

常见错误类型：

1. 未定义
2. 不是一个函数
3. let 不能在初始化之前使用
4. 常量值不能改变
5. 超出最大执行栈
6. 无效参数
7. const 声明没有赋值错误

```js
// 抛出错误 和 捕获错误
{
  try {
    const str = '这是一个错误';
    throw str; // 抛出
  } catch (error) {
    // catch捕获
    console.log(error);
  }
}
```

## 由浅入深掌握 Javascript

```js
{
  /* 
    对JS的理解
      动态类型语言：代码在执行过程中，才知道这个变量属于的类型。
      弱类型：数据类型不固定，可以随时改变。
      解释型：一边执行，一边编译，不需要程序在运行之前需要整体先编译。
      基于对象：最终所有对象都指向Object。
      脚本语言：一般都是可以嵌在其它编程语言当中执行。
      单线程：依次执行，前面代码执行完后面才执行。

  ECMAscript	                DOM	                      BOM  
  JavaScript的语法部分  	    文档对象模型	           浏览器对象模型
  主要包含JavaScript语言语法  主要用来操作页面元素和样式 主要用来操作浏览器相关功能
  */
}

{
  // JS数据类型有哪些？值是如何存储的？
  // 基本数据类型:
  Number;
  String;
  Boolean;
  undefined;
  null;
  Symbol; // ES6新增，表示独一无二的值
  BigInt; // ES6新增，以n结尾，表示超长数据

  // 对象：
  Object;
  Function;
  Array;
  Date;
  RegExp;
  Error;

  /* 
    基本数据类型值是不可变的，多次赋值，只取最后一个。
    基本数据类型存储在栈中，占据空间小
    引用数据类型存储在堆中。引用数据类型占据空间大
    引用数据类型在栈中存储了指针，该指针指向堆中该实体的起始地址。当解释器寻找引用值时，会首先检索其在栈中的地址，取得地址后从堆中获得实体。
  */
}

{
  /* 
    4. Null、undefined、undeclared 的 区别
       null表示空的，什么都没有，不存在的对象，他的数据类型是object。 初始值赋值为null，表示将要赋值为对象， 不再使用的值设为null，浏览器会自动回收。
       
       undefined表示未定义，常见的为undefined情况： 一是变量声明未赋值， 二是数组声明未赋值； 三是函数执行但没有明确的返回值； 四是获取一个对象上不存在的属性或方法。
         变量声明未赋值，是 undefined。
         未声明的变量，是 undeclared。浏览器会报错a is not defined ，ReferenceError。
  */
  null, undefined;
}

{
  /* 
    JS数据类型转换 JS的显式数据类型转换一共有三种
      转字符串：.toString() String() 
      Sting()函数相可以将null和undefined转化为字符串，toString()转化会报错。

      转数值：Number() parseInt()  parseFloat()
      Number()函数  字符串合法数字则转化成数字 不合法则转化为NAN 
                    空串转化为0  null和undefined转0和NAN true转1 false转0
      parseInt()是从左向右获取一个字符串的合法整数位
      parseFloat()获取字符串的所有合法小数位

      转布尔：像false、0、空串、null、undefined和NaN这6种会转化为false
      

     常用的隐式类型转换有：任意值+空串转字符串、+a转数值、a-0 转数值等。
  */
  String(), toString();
  Number(), parseInt(), parseFloat();
  Boolean();
  0 + '', +'10', !!null;
}

{
  // 数据类型的判断
  // 1. typeof的返回值有八种，返回值是字符串，不能判断数组和null的数据类型，返回object。
  typeof ''; // string
  typeof 1; // number
  typeof true; // boolean
  typeof undefined; // undefined
  typeof Symbol(); // bigint
  typeof 1n; // symbol
  typeof new Function(); // function

  typeof null; //object 无效   这个是一个设计缺陷，造成的
  typeof []; //object 无效

  // 2.  instanceof  检查对象原型链上有没有该构造函数，可以精准判断引用数据类型
  ({}) instanceof Object; //true
  new Date() instanceof Date; //true
  new RegExp() instanceof RegExp; //true
  new Error() instanceof Error; //true

  [] instanceof Array; //true
  [] instanceof Object; //true

  (() => {}) instanceof Function; // true
  (() => {}) instanceof Object; // true

  // 3. constructor 访问它的构造函数。既可以检测基本类型又可以检测对象，但不能检测null和undefined
  // 注意函数的 constructor 是不稳定，如果把函数的原型进行重写，这样检测出来的结果会不准确
  (10).constructor === Number; // true
  [].constructor === Array; // true
  new RegExp().constructor === RegExp; // true
  new RegExp().constructor === Object; // false

  function Fn() {}
  Fn.prototype = new Array();
  new Fn().constructor; // [Function: Array]
  (() => {}).constructor; // [Function: Function]

  // 4. 最准确方式 —— Object.prototype.toString.call()
  /*
    获取Object原型上的toString方法，让方法执行
    让toString方法中的this指向第一个参数的值，最准确方式。
    
    第一个object：当前实例是对象数据类型的(object)
    第二个Object：数据类型。
  */
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
}

{
  // 0.1+0.2 === 0.3吗
  console.log(0.1 + 0.2 === 0.3); // false
  console.log((0.1 + 0.2).toFixed(2)); // 0.30  toFixed为四舍五入
  /*
    计算机是通过二进制的方式存储数据的
    所以计算机计算0.1+0.2的时候，实际上是计算的两个数的二进制的和
    0.1的二进制是0.0001100110011001100...（1100循环）
    0.2的二进制是：0.00110011001100...（1100循环）

    这两个数的二进制都是无限循环的数,那JavaScript是如何处理无限循环的二进制小数呢？
    一般我们认为数字包括整数和小数
    但是在 JavaScript 中只有一种数字类型：Number
    它的实现遵循IEEE 754标准，使用64位固定长度来表示，也就是标准的double双精度浮点数
    在二进制科学表示法中，双精度浮点数的小数部分最多只能保留52位
    再加上前面的1，其实就是保留53位有效数字，剩余的需要舍去，遵从“0舍1入”的原则
    根据这个原则，0.1和0.2的二进制数相加，再转化为十进制数就是：0.30000000000000004。
  */
}

{
  // JS的作用域和作用域链
  /*
    作用域就是变量起作用的范围和区域  作用域的目的是隔离变量，保证不同作用域下同名变量不会冲突

    JS中，作用域分为三种，全局作用域、函数作用域和块级作用域。 
      全局作用域在script标签对中，无论在哪都能访问到。
      在函数内部定义的变量，拥有函数作用域。
      块级作用域则是使用let和const声明的变量，如果被一个大括号括住，那么这个大括号括住的变量区域就形成了一个块级作用域。

    作用域层层嵌套，形成的关系叫做作用域链，
    作用域链也就是查找变量的过程: 查找变量的过程：当前作用域 ->上一级作用域 ->上一级作用域 .... ->直到找到全局作用域 ->还没有，则会报错。
    
    作用域链是用来保证——变量和函数在执行环境中有序访问。
  */
  // LHS和RHS查询
  /*
    LHS和RHS查询是JS引擎查找变量的两种方式
    这里的“Left”和“Right”，是相对于赋值操作来说
      当变量出现在赋值操作左侧时，执行LHS操作 意味着变量赋值或写入内存，,他强调是写入这个动作。
        let name = '小明';
      当变量出现在赋值操作右侧或没有赋值操作时，是RHS。
        let myName = name;
  */
  //  词法作用域和动态作用域
  /*
    Js底层遵循的是词法作用域，从语言的层面来说，作用域模型分两种：
      词法作用域：也称静态作用域，是最为普遍的一种作用域模型
      动态作用域：相对“冷门”，bash脚本、Perl等语言采纳的是动态作用域
      
      词法作用域：在代码书写时完成划分，作用域沿着它定义的位置往外延伸。
      动态作用域：在代码运行时完成划分，作用域链沿着他的调用栈往外延伸。
  */
}

{
  // Js的事件轮询
  /*
    JS是单线程运行，同一时间只能干一件事情
    异步要基于回调实现。事件轮询就是异步回调实现的原理。
    
    首先来说JS从前到后一行一行执行，当遇到代码报错，后面的代码将不再执行
    先把同步代码执行完，在执行异步。
    
    event loop过程：
      1. 同步代码，一行一行放入调用栈中执行。
      2. 遇到异步，先记录下来，等待时机。（例如计时器放入到web APIs里）。
      3. 时机到了就会移动到callback Queue中。
      4. 同步代码执行完（call stack为空），event loop开始工作。
      5. event loop 轮训查找callback queue,如果有则移动到call stack执行。如果没有，继续轮训查找。（像永动机一样）。
  */
  // 宏任务 微任务
  /*
    宏任务：script ajax请求、计时器、DOM事件 postMessage、MessageChannel
    微任务：promise/async await MutationObserver  process.nextTick（Node.js）
    微任务执行时机比宏任务早
  */
  // 事件轮询和DOM渲染问题
  /*
    JS是单线程的，而且和DOM渲染公用一个线程，JS执行的时候，得留一些时机供DOM渲染。
      1. 每次调用栈清空，同步任务执行完
      3. 都是DOM重新渲染的机会，DOM结构如有改变则重新渲染
      4. 然后去触发下一次event loop

    为什么微任务比宏任务执行更早
      1. 微任务：dom渲染前触发
      2. 宏任务：dom渲染后触发
  */
}

{
  // 函数
  {
    /* 
          匿名函数 也叫一次性函数，没有名字
          在定义时执行，且执行一次，不存在预解析（函数内部执行的时候会发生）。
          
          匿名函数的作用有：
            1. 对项目的初始化，页面加载时调用，保证页面有效的写入Js，不会造成全局变量污染
            2. 防止外部命名空间污染
            3. 隐藏内部代码暴露接口
        */
    (function () {})();

    (function () {})();

    //  使用多种运算符开头，一般是用!
    !(function () {})();
  }

  {
    /* 
          回调函数  一段可执行的代码段
          它作为一个参数传递给其他的代码，其作用是在需要的调用这段回调函数
        */

    // 例 点击事件的回调函数  异步请求的回调函数 计时器
    setTimeout(function () {
      console.log('hello');
    }, 1000);
  }

  {
    /* 
          构造函数
            在ES6之前，我们都是通过构造函数创建类，从而生成对象实例
            构造函数就是一个函数，只不过通常我们把构造函数的名字写成大驼峰
            构造函数通过new关键字进行调用，普通函数直接调用。
        */
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
  }

  {
    /* 
          函数中arguments 的对象
            函数在调用时JS引擎会向函数中传递两个的隐含参数
            一个是this，另一个是arguments
            arguments是一个伪数组，用于获取函数中在调用时传入的实参。
        */
    function add() {
      console.log(Array.isArray(arguments));
    }
  }
}

{
  // 字符串
  {
    /* 
          列举常用字符串方法:
          charAt()	返回指定索引的字符

          charCodeAt()	返回指定索引的字符编码

          concat()	将原字符串和指定字符串拼接，不指定相当于复制一个字符串

          String.fromCharCode()	返回指定编码的字符

          indexOf()	查询并返回指定子串的索引，不存在返回-1

          lastIndexOf()	反向查询并返回指定子串的索引，不存在返回-1

          localeCompare()	比较原串和指定字符串：原串大返回1,原串小返回-1，相等返回0

          slice()	截取指定位置的字符串，并返回。包含起始位置但是不包含结束位置，位置可以是负数

          substr()	截取指定起始位置固定长度的字符串

          substring()	截取指定位置的字符串，类似slice。起始位置和结束位置可以互换并且不能是负数

          split()	将字符串切割转化为数组返回

          toLowerCase()	将字符串转化为小写

          toUpperCase()	将字符串转化为大写

          valueOf()	返回字符串包装对象的原始值

          toString()	直接转为字符串并返回

          includes()	判断是否包含指定的字符串

          startsWith()	 判断是否以指定字符串开头

          endsWith()	判断是否以指定字符串结尾

          repeat()	重复指定次数
        */
  }
}

{
  // 数组
  {
    /* 
           列举常用数组方法：
           concat()	合并数组，并返回合并之后的数据

           join()	使用分隔符，将数组转为字符串并返回

           pop()	删除最后一位，并返回删除的数据，在原数组

           shift()	删除第一位，并返回删除的数据，在原数组

           unshift()	在第一位新增一或多个数据，返回长度，在原数组

           push()	在最后一位新增一或多个数据，返回长度

           reverse()	反转数组，返回结果，在原数组

           slice()	截取指定位置的数组，并返回

           sort()	排序（字符规则），返回结果，在原数组

           splice()	删除指定位置，并替换，返回删除的数据

           toString()	直接转为字符串，并返回

           valueOf()	返回数组对象的原始值

           indexOf()	查询并返回数据的索引

           lastIndexOf()	反向查询并返回数据的索引

           forEach()	参数为回调函数，会遍历数组所有的项，回调函数接受三个参数，分别为value，index，self；forEach没有返回值

           map()	同forEach，同时回调函数返回数据，组成新数组由map返回

           filter()	同forEach，同时回调函数返回布尔值，为true的数据组成新数组由filter返回

           Array.from()	将伪数组对象或可遍历对象转换为真数组

           Array.of()	将一系列值转换成数组

           find	找出第一个满足条件返回true的元素

           findIndex	找出第一个满足条件返回true的元素下标
        */
  }
}

{
  // 对象
  {
    /* 
          对象常用方法:
          Object.assign()  浅拷贝

          Object.create()  需要传入一个参数，作为新建对象的原型对象

          Object.is()  判断两个值是否相等

          Object.keys() 获取给定对象的自身可枚举属性的属性名（键）

          Object.values() 获取给定对象的自身可枚举属性的属性值（值）

          Object.entries() 返回键值对数组

          Object.fromEntries()  将键值对数组转换为对象
          
          Object.defineProperty() 给对象定义新属性、修改现有属性
          Object.defineProperties() 可一次性处理多个属性

          Object.proxy() Proxy是一个构造函数，用它来代理某些操作

          Object.getOwnPropertyDescription() 获取对象上的一个自有属性的属性描述
          Object.getOwnPropertyDescriptors() 获取对象的所有自身属性的描述符

          Object.getOwnPropertyNames() 获取对象自身拥有的可枚举属性和不可枚举属性的属性名，返回一个数组

          Object.prototype.hasOwnProperty() 判断对象自身属性是否含有指定的属性，不包括从原型链上继承的属性

          Object.getPrototypeOf()  返回指定对象的原型，如果没有则返回null

          Object.setPrototypeOf() 设置指定对象的新原型

          Object.prototype.isPrototypeOf() 检测一个对象是否存在于另一个对象的原型链上

          Object.toString() 每个对象都有这个方法，用于返回一个表示该对象的字符串，不同类型的数据都重写了toString方法，因此返回的值不一样

          Object.toLocaleString() 将对象根据语言环境来转换字符串
        */
  }
}

{
  // Math常用方法
  Math.abs(); // 绝对值

  Math.ceil(); // 向上取整

  Math.floor(); // 向下取整

  Math.max(); // 最大值

  Math.min(); // 最小值

  Math.round(); // 四舍五入

  Math.random(); // 随机数

  Math.pow(); // 指数运算

  Math.sqrt(); // 平方根

  Math.log(); // 返回以e为底的自然对数值

  Math.exp(); // 返回常数e的参数次方

  // Math属性  只读，不可修改
  Math.E; // 2.718281828459045  常数e
  Math.LN2; // 0.6931471805599453   2的自然对数
  Math.LN10; // 2.302585092994046   10的自然对数
  Math.LOG2E; // 1.4426950408889634  以2为底的e的对数
  Math.LOG10E; // 0.4342944819032518  以10为底的e的对数
  Math.PI; // 3.141592653589793 常数π
  Math.SQRT1_2; // 0.7071067811865476  0.5的平方根
  Math.SQRT2; // 1.4142135623730951  2 的平方根
}
```
