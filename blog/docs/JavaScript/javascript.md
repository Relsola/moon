# JavaScript 知识笔记

## BOM

## DOM

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

/* 
   拓展...
     1. status 由服务器返回的 HTTP 状态代码
     2. statusText 这个属性用名称而不是数字指定了请求的 HTTP 的状态代码。
     3. timeout  超时时间，毫秒数。

     4. abort() 取消当前响应，关闭连接并且结束任何未决的网络活动。
     5. getAllResponseHeaders() 把 HTTP 响应头部作为未解析的字符串返回。
     6. getResponseHeader() 返回指定的 HTTP 响应头部的值。其参数是要返回的 HTTP 响应头部的名称。

     事件监听
       1.  progress(加载进度)
       2.  load(请求完成并接受到服务器返回结果)
       3.  error(请求错误)
       4.  abort(终止请求)。
*/
```

### FromData 对象

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

/* 
   FormData 对象的方法
     1. get(key) 与 getAll(key) 获取相对应的值
     2. append(key,value) 在数据末尾追加数据
     3. set(key, value) 设置修改数据
     4. has(key) 判断是否存在对应的 key 值
     6. delete(key) 删除数据
     7. entries() 获取一个迭代器，然后遍历所有的数据
*/
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

## ES6+

### class

## 正则表达式

## 位运算
