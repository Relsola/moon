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

  fromData.append('name', 'zhangsan');
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

## class

## 正则表达式

## 位运算
