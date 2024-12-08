# JavaScript 知识笔记

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

```js
// table() 把数据 data 以表格的形式打印出来 对象会枚举
const data = [
  ['name', 'Tom'],
  ['age', 18],
  ['gander', '男']
];
console.table(data);

// dir() 在控制台中查看指定 JavaScript 对象的所有属性
// dirxml() 显示一个明确的 XML/HTML 元素的包括所有后代元素的交互树,如果无法作为一个 element 被显示，那么会以 JavaScript 对象的形式作为替代
console.dir(globalThis.document ?? 'window');
console.dirxml(globalThis.document ?? 'window');

// error() / warn() 向 Web 控制台输出一条错误 / 警号消息。
console.error({ a: 1 });
console.warn('{ a: 1 }');

// time() timeEnd() timeLog() 测量程序中某一特定操作所需的时间
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

// trace() 可以帮助您在调用它的位置输出当前堆栈跟踪
function a() {
  b();
}
function b() {
  (() => {
    c();
  })();
}
function c() {
  console.trace();
}
a();

// assert() 如果断言为 false，则将一个错误消息写入控制台。如果断言是 true，没有任何反应。
const num = 13;
console.assert(num > 10, 'Number must be greater than 10');
console.assert(num > 20, 'Number must be greater than 20');

// count() 记录调用 count(label?) 的次数  不传值默认 'default'
// countReset(label?) 重置count()计数器
for (let i = 0, str = 'div'; i <= 4; )
  i++ === 2 ? console.countReset(str) : console.count(str);

// log() info() debug() 都是让控制台输出消息，几乎没什么不同，用console.log就行
console.log('log'); // 支持的占位符
console.info('info');
console.debug('debug');

// group(label?), groupCollapsed(label?), and groupEnd()
//  接收一个参数label分组标签 缩进 折叠 回退缩进
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
console.log('⭐⭐⭐⭐⭐');

// 开始记录性能描述信息 有兼容等各种问题
console.profile('profileName'); // 启动性能分析
(() => [].map(_ => _ >> 1))(); // ...执行耗时操作
console.profileEnd('profileName'); // 停止性能分析

// console.memory  console对象的一个属性 用来查看当前内存的使用情况
console.log(console.memory);

// clear() 如果该控制台允许则清空控制台
console.clear();

// createTask() ... 自行探索
const fn = () => {
  console.log("'fn'run...");
};
// 浏览器中有效 run...
// console.createTask(window.toString()).run(fn);
```

## 正则表达式

## 位运算

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
