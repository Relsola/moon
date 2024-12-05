# 手写系列

## new 操作符

```js
function myNew(constructor, ...arg) {
  // 改变obj原型指向
  const obj = Object.create(constructor.prototype);
  // 将obj作为上下文this指向
  const result = constructor.apply(obj, arg);
  // 正确输出结果
  return result !== null && typeof result === 'object' ? result : obj;
}
```

## apply 方法

```js
Function.prototype.apply2 = function (context, rest) {
  // 判断传入的this，为空时要赋值为window或global
  if (!context) context = typeof window === undefined ? global : window;
  // 为了避免冲突 用Symbol
  const key = Symbol('key');
  // 获取调用call的函数，用this可以获取
  context[key] = this;
  // 改变this指向，执行上下文
  const result = context[key](...rest);
  // 删除键
  delete context[key];
  return result;
};
```

## call 方法

```js
Function.prototype.call2 = function (context, ...arg) {
  // 判断传入的this，为空时要赋值为window或global
  if (!context) context = typeof window === undefined ? global : window;
  // 为了避免冲突 用Symbol
  const key = Symbol('key');
  // 改变this指向，执行上下文
  context[key] = this;
  const result = context[key](...arg);
  // 删除键 输出结果
  delete context[key];
  return result;
};
```

## bing 方法

```js
Function.prototype.bind2 = function (context, ...arg) {
  // 首先要获取调用bind的函数，也就是绑定函数，用this可以获取
  const self = this;
  const Bound = function () {
    const thisArg = arg.concat(...arguments);
    // 用于构造函数忽略this指向
    return this instanceof Bound
      ? new Bound(...thisArg)
      : self.apply(context, thisArg);
  };
  // 保护目标原型
  const emptyFn = function () {};
  emptyFn.prototype = this.prototype;
  Bound.prototype = new emptyFn();
  return Bound;
};
```

## Promise

```js
class myPromise {
  static PENDING = 'pending';
  static FULFILLED = 'fulfilled';
  static REJECTED = 'rejected';

  constructor(func) {
    this.PromiseState = myPromise.PENDING;
    this.PromiseResult = null;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    try {
      func(this.resolve.bind(this), this.reject.bind(this));
    } catch (error) {
      this.reject(error);
    }
  }

  resolve(value) {
    this.changeState(myPromise.FULFILLED, value);
  }
  reject(value) {
    this.changeState(myPromise.REJECTED, value);
  }

  changeState(state, result) {
    if (this.PromiseState !== myPromise.PENDING) return;
    this.PromiseState = state;
    this.PromiseResult = result;
    state === myPromise.FULFILLED
      ? this.onFulfilledCallbacks.forEach(callback => {
          callback();
        })
      : this.onRejectedCallbacks.forEach(callback => {
          callback();
        });
  }

  runOnce(promise2, callback, resolve, reject, state) {
    try {
      if (typeof callback !== 'function') {
        state ? resolve(this.PromiseResult) : reject(this.PromiseResult);
      } else {
        const x = callback(this.PromiseResult);
        resolvePromise(promise2, x, resolve, reject);
      }
    } catch (e) {
      reject(e);
    }
  }

  then(onFulfilled, onRejected) {
    const promise2 = new myPromise((resolve, reject) => {
      switch (this.PromiseState) {
        case myPromise.FULFILLED:
          setTimeout(() => {
            this.runOnce(promise2, onFulfilled, resolve, reject, true);
          });
          break;

        case myPromise.REJECTED:
          setTimeout(() => {
            this.runOnce(promise2, onRejected, resolve, reject, false);
          });
          break;

        default:
          this.onFulfilledCallbacks.push(() => {
            setTimeout(() => {
              this.runOnce(promise2, onFulfilled, resolve, reject, true);
            });
          });
          this.onRejectedCallbacks.push(() => {
            setTimeout(() => {
              this.runOnce(promise2, onRejected, resolve, reject, false);
            });
          });
          break;
      }
    });
    return promise2;
  }

  /**
   * Promise.resolve()
   * @param {[type]} value 要解析为 Promise 对象的值
   */
  static resolve = value => {
    // 如果这个值是一个 promise ，那么将返回这个 promise
    if (value instanceof myPromise) return value;
    else if (value instanceof Object && 'then' in value) {
      // 如果这个值是thenable（即带有`"then" `方法），返回的promise会“跟随”这个thenable的对象，采用它的最终状态；
      return new myPromise((resolve, reject) => {
        value.then(resolve, reject);
      });
    }

    // 否则返回的promise将以此值完成，即以此值执行`resolve()`方法 (状态为fulfilled)
    return new myPromise(resolve => {
      resolve(value);
    });
  };

  /**
   * Promise.reject()
   * @param {*} reason 表示Promise被拒绝的原因
   * @returns
   */
  static reject = reason =>
    new myPromise((_, reject) => {
      reject(reason);
    });

  /**
   * Promise.prototype.catch()
   * @param {*} onRejected
   * @returns
   */
  catch(onRejected) {
    return this.then(undefined, onRejected);
  }

  /**
   * Promise.prototype.finally()
   * @param {*} callBack 无论结果是fulfilled或者是rejected，都会执行的回调函数
   * @returns
   */
  finally(callBack) {
    return this.then(callBack, callBack);
  }

  /**
   * Promise.all()
   * @param {iterable} promises 一个promise的iterable类型（注：Array，Map，Set都属于ES6的iterable类型）的输入
   * @returns
   */
  static all(promises) {
    return new myPromise((resolve, reject) => {
      // 参数校验
      if (Array.isArray(promises)) {
        let result = []; // 存储结果
        let count = 0; // 计数器

        // 如果传入的参数是一个空的可迭代对象，则返回一个已完成（already resolved）状态的 Promise
        if (promises.length === 0) {
          return resolve(promises);
        }

        promises.forEach((item, index) => {
          // myPromise.resolve方法中已经判断了参数是否为promise与thenable对象，所以无需在该方法中再次判断
          myPromise.resolve(item).then(
            value => {
              count++;
              // 每个promise执行的结果存储在result中
              result[index] = value;
              // Promise.all 等待所有都完成（或第一个失败）
              count === promises.length && resolve(result);
            },
            reason => {
              /**
               * 如果传入的 promise 中有一个失败（rejected），
               * Promise.all 异步地将失败的那个结果给失败状态的回调函数，而不管其它 promise 是否完成
               */
              reject(reason);
            }
          );
        });
      } else {
        return reject(new TypeError('Argument is not iterable'));
      }
    });
  }

  /**
   * Promise.allSettled()
   * @param {iterable} promises 一个promise的iterable类型（注：Array，Map，Set都属于ES6的iterable类型）的输入
   * @returns
   */
  static allSettled(promises) {
    return new myPromise((resolve, reject) => {
      // 参数校验
      if (Array.isArray(promises)) {
        let result = []; // 存储结果
        let count = 0; // 计数器

        // 如果传入的是一个空数组，那么就直接返回一个resolved的空数组promise对象
        if (promises.length === 0) return resolve(promises);

        promises.forEach((item, index) => {
          // 非promise值，通过Promise.resolve转换为promise进行统一处理
          myPromise.resolve(item).then(
            value => {
              count++;
              // 对于每个结果对象，都有一个 status 字符串。如果它的值为 fulfilled，则结果对象上存在一个 value 。
              result[index] = {
                status: 'fulfilled',
                value
              };
              // 所有给定的promise都已经fulfilled或rejected后,返回这个promise
              count === promises.length && resolve(result);
            },
            reason => {
              count++;
              /**
               * 对于每个结果对象，都有一个 status 字符串。如果值为 rejected，则存在一个 reason 。
               * value（或 reason ）反映了每个 promise 决议（或拒绝）的值。
               */
              result[index] = {
                status: 'rejected',
                reason
              };
              // 所有给定的promise都已经fulfilled或rejected后,返回这个promise
              count === promises.length && resolve(result);
            }
          );
        });
      } else {
        return reject(new TypeError('Argument is not iterable'));
      }
    });
  }

  /**
   * Promise.any()
   * @param {iterable} promises 一个promise的iterable类型（注：Array，Map，Set都属于ES6的iterable类型）的输入
   * @returns
   */
  static any(promises) {
    return new myPromise((resolve, reject) => {
      // 参数校验
      if (Array.isArray(promises)) {
        let errors = []; //
        let count = 0; // 计数器

        // 如果传入的参数是一个空的可迭代对象，则返回一个 已失败（already rejected） 状态的 Promise。
        if (promises.length === 0)
          return reject(new AggregateError([], 'All promises were rejected'));

        promises.forEach(item => {
          // 非Promise值，通过Promise.resolve转换为Promise
          myPromise.resolve(item).then(
            value => {
              // 只要其中的一个 promise 成功，就返回那个已经成功的 promise
              resolve(value);
            },
            reason => {
              count++;
              errors.push(reason);
              /**
               * 如果可迭代对象中没有一个 promise 成功，就返回一个失败的 promise 和AggregateError类型的实例，
               * AggregateError是 Error 的一个子类，用于把单一的错误集合在一起。
               */
              count === promises.length &&
                reject(
                  new AggregateError(errors, 'All promises were rejected')
                );
            }
          );
        });
      } else {
        return reject(new TypeError('Argument is not iterable'));
      }
    });
  }

  /**
   * Promise.race()
   * @param {iterable} promises 可迭代对象，类似Array。详见 iterable。
   * @returns
   */
  static race(promises) {
    return new myPromise((resolve, reject) => {
      // 参数校验
      if (Array.isArray(promises)) {
        // 如果传入的迭代promises是空的，则返回的 promise 将永远等待。
        if (promises.length > 0) {
          promises.forEach(item => {
            /**
             * 如果迭代包含一个或多个非承诺值和/或已解决/拒绝的承诺，
             * 则 Promise.race 将解析为迭代中找到的第一个值。
             */
            myPromise.resolve(item).then(resolve, reject);
          });
        }
      } else {
        return reject(new TypeError('Argument is not iterable'));
      }
    });
  }
}

/**
 * 对resolve()、reject() 进行改造增强 针对resolve()和reject()中不同值情况 进行处理
 * @param  {promise} promise2 promise1.then方法返回的新的promise对象
 * @param  {[type]} x         promise1中onFulfilled或onRejected的返回值
 * @param  {[type]} resolve   promise2的resolve方法
 * @param  {[type]} reject    promise2的reject方法
 */
function resolvePromise(promise2, x, resolve, reject) {
  if (x === promise2)
    throw new TypeError('Chaining cycle detected for promise');

  if (x instanceof myPromise)
    x.then(y => {
      resolvePromise(promise2, y, resolve, reject);
    }, reject);
  else if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    try {
      var then = x.then;
    } catch (e) {
      return reject(e);
    }

    if (typeof then === 'function') {
      let called = false;
      try {
        then.call(
          x,
          y => {
            if (called) return;
            called = true;
            resolvePromise(promise2, y, resolve, reject);
          },
          r => {
            if (called) return;
            called = true;
            reject(r);
          }
        );
      } catch (e) {
        if (called) return;
        called = true;
        reject(e);
      }
    } else resolve(x);
  } else return resolve(x);
}

myPromise.deferred = function () {
  const result = {};
  result.promise = new myPromise((resolve, reject) => {
    result.resolve = resolve;
    result.reject = reject;
  });
  return result;
};

module.exports = myPromise;
```

## AJAX

```js
// 手写AJAX
const xhr = new XMLHttpRequest();
xhr.onreadystatechange = function () {
  if (xhr.readyState !== 4) return;
  if (xhr.status) {
    // ...
    console.log(xhr.response);
  } else {
    // ...
    new Error(xhr.statusText);
  }
};
xhr.open('GET', url, true);
xhr.send();

// 使用Promise封装AJAX
function ajax(methods, url, data) {
  const xhr = new XMLHttpRequest();
  return new Promise((resolve, reject) => {
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return;
      if (xhr.status === 200) resolve(xhr.responseText);
      else reject(xhr.statusText);
    };
    xhr.open(methods, url);
    xhr.send(data);
  });
}

ajax('GET', '/get')
  .then(data => {
    // AJAX成功，拿到响应数据
    console.log(data);
  })
  .catch(status => {
    // AJAX失败，根据响应码判断失败原因
    new Error(status);
  });

/* 
  open(method,url,async) 方法 规定 请求的类型、URL 以及 是否异步处理请求。
    method：请求的类型；GET 或 POST
    url：文件在服务器上的位置
    async：true（异步）或 false（同步），默认值为true
    
  send(string) 方法 将请求发送到服务器。
    string：仅用于 POST 请求
    如果需要像获取 HTML 表单那样 POST 数据，请使用 setRequestHeader() 来添加 HTTP 头。然后在 send() 方法中规定您希望发送的数据：
    xhr.open("POST",url,true); 
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded"); 
    xhr.send("fname=Henry&lname=Ford");


  设置状态监听函数
    当请求被发送到服务器时，我们需要执行一些基于响应的任务，处理服务器响应。
    每当 readyState 改变时，就会触发 onreadystatechange 事件。
    readyState 属性存有 XMLHttpRequest 的状态信息。
    XMLHttpRequest 对象的三个重要的属性：
      onreadystatechange - 存储函数（或函数名），每当 readyState 属性改变时，就会调用该函数。

      readyState - 存有 XMLHttpRequest 的状态。请求状态 从 0 到 4 发生变化。
        0: 请求未初始化
        1: 服务器连接已建立
        2: 请求已接收
        3: 请求处理中
        4: 请求已完成，且响应已就绪
        
      status - HTTP响应码
        200: "OK"
        404: 未找到页面
        等
    
    每当 readyState 发生变化时就会调用 onreadystatechange 函数。
    当 readyState 等于 4 且状态为 200 时，表示响应已就绪：
*/
```

## 发布订阅

```js
class EventEmitter {
  constructor() {
    // 用一个对象来保存事件和订阅者
    this.events = {};
  }

  // 添加事件
  on(event, listener) {
    if (this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  // 触发事件
  emit(event, ...arg) {
    const listeners = this.events[event] ?? [];
    listeners.forEach(listener => listener(...arg));
  }

  // 移除事件
  off(event, listener) {
    const listeners = this.events[event] ?? [];
    const index = listeners.indexOf(listener);
    if (index !== -1) listener.splice(index, 1);
  }
}
```
