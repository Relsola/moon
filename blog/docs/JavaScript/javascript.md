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

## 常见配置

### .prettierrc

```json
{
  "printWidth": 120,
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": true,
  "trailingComma": "none",
  "bracketSameLine": false,
  "arrowParens": "avoid",
  "htmlWhitespaceSensitivity": "ignore",
  "endOfLine": "crlf",
  "eslintIntegration": false
}
```

### vscode 配置文件

```json
{
  "workbench.settings.applyToAllProfiles": [
    "workbench.colorTheme",
    "workbench.iconTheme",
    "editor.fontFamily",
    "window.zoomLevel",
    "editor.fontSize",
    "editor.formatOnSave",
    "editor.formatOnPaste",
    "window.dialogStyle",
    "editor.mouseWheelZoom",
    "files.autoSave",
    "files.autoSaveDelay",
    "editor.fontLigatures",
    "cSpell.userWords",
    "editor.smoothScrolling",
    "workbench.list.smoothScrolling",
    "terminal.integrated.smoothScrolling",
    "editor.cursorBlinking",
    "editor.formatOnType",
    "editor.suggest.snippetsPreventQuickSuggestions",
    "editor.cursorSmoothCaretAnimation",
    "terminal.integrated.defaultProfile.windows",
    "files.autoGuessEncoding",
    "explorer.confirmDelete",
    "explorer.confirmDragAndDrop",
    "debug.showBreakpointsInOverviewRuler",
    "window.menuBarVisibility"
  ],
  // 全局设置
  "workbench.colorTheme": "One Dark Pro",
  "workbench.iconTheme": "material-icon-theme",
  "editor.fontFamily": "JetBrainsMono",
  "window.zoomLevel": -1,
  "editor.fontSize": 16,
  "editor.formatOnSave": true,
  "editor.formatOnPaste": true,
  "window.dialogStyle": "custom",
  "editor.mouseWheelZoom": true,
  "files.autoSave": "afterDelay",
  "files.autoSaveDelay": 1000,
  "editor.fontLigatures": false,
  "editor.smoothScrolling": true,
  "workbench.list.smoothScrolling": true,
  "terminal.integrated.smoothScrolling": true,
  "editor.cursorBlinking": "smooth",
  "editor.formatOnType": true,
  "editor.suggest.snippetsPreventQuickSuggestions": false,
  "editor.cursorSmoothCaretAnimation": "explicit",
  "terminal.integrated.defaultProfile.windows": "Command Prompt",
  "files.autoGuessEncoding": true,
  "explorer.confirmDelete": false,
  "explorer.confirmDragAndDrop": false,
  "debug.showBreakpointsInOverviewRuler": true,
  "window.menuBarVisibility": "visible",

  // 全局单词错误忽视
  "cSpell.userWords": ["Relsola", "Parens", "esbenp"],

  // 将在视区宽度处换行
  "editor.wordWrap": "on",
  // 是否应以紧凑形式呈现文件夹
  "explorer.compactFolders": false,

  "security.workspace.trust.untrustedFiles": "open",
  "editor.unicodeHighlight.allowedLocales": {
    "zh-hans": true
  },
  "liveServer.settings.donotShowInfoMsg": true,

  "editor.suggestSelection": "first",
  "liveServer.settings.donotVerifyTags": true,
  "workbench.editorAssociations": {
    "*.pdf": "default"
  },
  "git.confirmSync": false,
  "git.enableSmartCommit": true,

  "editor.acceptSuggestionOnEnter": "smart",
  "code-runner.runInTerminal": true,
  "code-runner.saveAllFilesBeforeRun": true,
  "code-runner.saveFileBeforeRun": true,
  "projectManager.sortList": "Name",

  "editor.tabCompletion": "on", //启用Tab补全
  "editor.detectIndentation": false, //不基于文件内容选择缩进用制表符还是空格 因为有时候VSCode的判断是错误的

  "editor.insertSpaces": true, //敲下Tab键时插入4个空格而不是制表符
  "editor.copyWithSyntaxHighlighting": false, //复制代码时复制纯文本而不是连语法高亮都复制了
  "editor.stickyTabStops": true, //在缩进上移动光标时四个空格一组来移动，就仿佛它们是制表符(\t)一样
  "editor.wordBasedSuggestions": false, //关闭基于文件中单词来联想的功能（语言自带的联想就够了，开了这个会导致用vscode写MarkDown时的中文引号异常联想）
  "editor.renderControlCharacters": true, // 编辑器中显示不可见的控制字符
  /*terminal*/

  "terminal.integrated.cursorBlinking": false, // 终端光标闪烁
  "terminal.integrated.rightClickBehavior": "default", //在终端中右键时显示菜单而不是粘贴（个人喜好）
  /*files*/
  "files.exclude": {
    //隐藏一些碍眼的文件夹
    "**/.git": true,
    "**/.svn": true,
    "**/.hg": true,
    "**/CVS": true,
    "**/.DS_Store": true,
    "**/tmp": true,
    "**/node_modules": true,
    "**/bower_components": true
  },
  "files.watcherExclude": {
    //不索引一些不必要索引的大文件夹以减少内存和CPU消耗
    "**/.git/objects/**": true,
    "**/.git/subtree-cache/**": true,
    "**/node_modules/**": true,
    "**/tmp/**": true,
    "**/bower_components/**": true,
    "**/dist/**": true
  },
  /*workbench*/
  "workbench.editor.enablePreview": false, //打开文件时不是“预览”模式，即在编辑一个文件时打开编辑另一个文件不会覆盖当前编辑的文件而是新建一个标签页
  "workbench.editor.wrapTabs": true, // 编辑器标签页在空间不足时以多行显示
  /*explorer*/

  /*search*/
  "search.followSymlinks": false, //据说可以减少vscode的CPU和内存占用
  /*debug*/
  "debug.internalConsoleOptions": "openOnSessionStart", //每次调试都打开调试控制台，方便调试

  "debug.toolBarLocation": "docked", //固定调试时工具条的位置，防止遮挡代码内容（个人喜好）
  "debug.saveBeforeStart": "nonUntitledEditorsInActiveGroup", //在启动调试会话前保存除了无标题文档以外的文档（毕竟你创建了无标题文档就说明你根本没有想保存它的意思（至少我是这样的。））
  "debug.onTaskErrors": "showErrors", //预启动任务出错后显示错误，并不启动调试

  "Codegeex.Privacy": true,
  "Codegeex.Comment.LanguagePreference": "zh-CN",
  "bitoAI.codeCompletion.setAutoCompletionTriggerLogic": 250,
  // 头部注释
  "fileheader.customMade": {
    "Description": "",
    "Version": "V1.0.0",
    "Author": "git config user.name && git config user.email",
    "Date": "Do not edit",
    "LastEditors": "git config user.name && git config user.email",
    "LastEditTime": "Do not edit",
    "FilePath": "only file name",
    "custom_string_obkoro1_date": "Do not edit", // 版权时间
    "custom_string_obkoro1_copyright": "Copyright ${now_year} Marvin, All Rights Reserved. "
  },
  // 函数注释
  "fileheader.cursorMode": {
    "description": "",
    "param": "",
    "return": ""
  },
  // 插件配置选项
  "fileheader.configObj": {
    "createFileTime": false,
    "autoAdd": false, // 自动添加头部注释是否开启，默认为true
    "autoAddLine": 100,
    "autoAlready": true,
    "annotationStr": {
      "head": "/*",
      "middle": " * @",
      "end": " */",
      "use": false
    },
    "headInsertLine": {
      "php": 2,
      "sh": 2
    },
    "beforeAnnotation": {
      "文件后缀": "该文件后缀的头部注释之前添加某些内容"
    },
    "afterAnnotation": {
      "文件后缀": "该文件后缀的头部注释之后添加某些内容"
    },
    "specialOptions": {
      "特殊字段": "自定义比如LastEditTime/LastEditors"
    },
    "switch": {
      "newlineAddAnnotation": true
    },
    "supportAutoLanguage": [],
    "prohibitAutoAdd": ["json", "md"], // 禁止自动添加头部注释的文件类型
    "folderBlacklist": ["node_modules", "文件夹禁止自动添加头部注释"],
    "prohibitItemAutoAdd": [
      "项目的全称, 整个项目禁止自动添加头部注释, 可以使用快捷键添加"
    ],
    "moveCursor": true,
    "dateFormat": "YYYY-MM-DD HH:mm:ss",
    "atSymbol": ["@", "@"],
    "atSymbolObj": {
      "文件后缀": ["头部注释@符号", "函数注释@符号"]
    },
    "colon": [": ", ": "],
    "colonObj": {
      "文件后缀": ["头部注释冒号", "函数注释冒号"]
    },
    "filePathColon": "路径分隔符替换",
    "showErrorMessage": false,
    "writeLog": false,
    "wideSame": true,
    "wideNum": 13, // 头部注释自动对齐的宽度
    "functionWideNum": 15, // 函数注释自动对齐宽度
    "CheckFileChange": true,
    "createHeader": false,
    "useWorker": false,
    "designAddHead": false,
    "headDesignName": "random", // 头部图案注释，默认随机
    "headDesign": false, // 默认关闭 开启后,所有生成头部注释的场景都会生成图案注释
    "cursorModeInternalAll": {},
    "openFunctionParamsCheck": true,
    "functionParamsShape": ["{", "}"],
    "functionBlankSpaceAll": {},
    "functionTypeSymbol": " ", // 参数没有类型时的默认值
    "typeParamOrder": "type param",
    "customHasHeadEnd": {},
    "throttleTime": 60000,
    "functionParamAddStr": ""
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[html]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[markdown]": {
    "editor.defaultFormatter": null
  },
  "workbench.layoutControl.enabled": false,
  "[less]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },

  // prettier 选项配置
  "prettier.printWidth": 150,
  "prettier.tabWidth": 2,
  "prettier.useTabs": false,
  "prettier.semi": true,
  "prettier.singleQuote": true,
  "prettier.quoteProps": "as-needed",
  "prettier.jsxSingleQuote": false,
  "prettier.trailingComma": "none",
  "prettier.bracketSpacing": true,
  "prettier.bracketSameLine": true,
  "prettier.arrowParens": "avoid",
  "prettier.proseWrap": "preserve",
  "prettier.htmlWhitespaceSensitivity": "ignore",
  "prettier.vueIndentScriptAndStyle": false,
  "prettier.endOfLine": "crlf",
  "prettier.embeddedLanguageFormatting": "auto",

  "[jsonc]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "material-icon-theme.activeIconPack": "angular",
  "material-icon-theme.folders.theme": "specific"
}
```
