# JavaScript 工具函数片段

## 添加和删除事件监听器

### 添加事件监听器

使用 `EventTarget.addEventListener()` 向元素添加事件监听器  
使用事件委托将单个事件监听器添加到 父元素，避免为单个元素添加事件监听造成性能浪费  
`opts.target` 指定将事件绑定在哪个子元素中，值是一个 css 选择器字符串  
`opts.options` 为 `EventTarget.addEventListener` 第三个参数配置项  
注意添加事件的返回值，用于 `EventTarget.removeEventListener()` 解除事件监听的绑定

```js
function on(el, event, fn, opts = {}) {
  const delegator = e => e.target.matches(opts.target) && fn.call(e.target, e);
  el.addEventListener(event, opts.target ? delegator : fn, opts.options || false);
  if (opts.target) return delegator;
}
```

### 移除事件监听器

使用 `EventTarget.removeEventListener()` 方法从元素中删除事件侦听器。  
需要保持函数签名与我们用于添加事件监听器的函数签名一致。

```js
function off(el, event, fn, opts = false) {
  el.removeEventListener(event, fn, opts);
}
```

### 示例

```js
const fn = e => console.log('1');

on(document.body, 'click', fn);
off(document.body, 'click', fn);

const delegator = on(document.body, 'click', fn, { target: 'p' });
off(document.body, 'click', delegator);

const delegatorCapturing = on(document.body, 'click', fn, {
  target: 'div',
  options: true
});
off(document.body, 'click', delegatorCapturing, true);
```

## 将文本复制到粘贴板

检查 `clipboard.writeText()` API 是否可用  
将给定的值写入剪切板并返回一个 `Promise`
如果剪贴板 API 不可用，则使用 `document.execCommand()` API 复制到剪贴板  
注意 `document.execCommand` 有弃用的风险

```js [JS]
function copyToClipboard(str) {
  if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(str);
  }

  const el = document.createElement('input');
  el.value = str;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  const selection = document.getSelection();
  const selected =
    selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : false;
  el.select();
  const flag = document.execCommand('copy');
  document.body.removeChild(el);
  if (selected) {
    const selection = document.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(selected);
    }
  }
  return flag ? Promise.resolve() : Promise.reject('copy failure');
}
```

## 录制动画帧

在每个动画帧 `requestAnimationFrame()` 上调用提供的回调函数  
返回一个具有 `start` 和 `stop` 方法的对象  
第二个参数控制是否需要显式调用 默认为 `true`

```js
function recordAnimationFrames(callback, autoStart = true) {
  let running = false,
    raf;
  const stop = () => {
    if (!running) {
      return;
    }
    running = false;
    cancelAnimationFrame(raf);
  };
  const start = () => {
    if (running) {
      return;
    }
    running = true;
    run();
  };
  const run = () => {
    raf = requestAnimationFrame(() => {
      callback();
      if (running) {
        run();
      }
    });
  };
  if (autoStart) {
    start();
  }
  return { start, stop };
}
```

### 示例

```js
const cb = () => console.log('111');

const recorder = recordAnimationFrames(cb);
setTimeout(() => recorder.stop(), 1000);

const recorder2 = recordAnimationFrames(() => console.log('222'), false);
setTimeout(() => recorder2.start(), 2000);
setTimeout(() => recorder2.stop(), 3000);
```

## 数组扁平化

> 示例数组

```js
const arr = [1, 2, [1, 2, [{ a: 1 }, ['hello']]], 'world'];
```

1. `flat`

> 常用 简洁

```js
arr.flat(Infinity);
```

2. `reduce`

```js
const flat = arr =>
  arr.reduce((pre, cur) => pre.concat(Array.isArray(cur) ? flat(cur) : cur), []);
```

3. 递归

```js
const flat = arr => {
  let result = [];
  arr.forEach(item => {
    result = result.concat(Array.isArray(item) ? flat(item) : item);
  });
  return result;
};
```

```js
const flat = arr => {
  const result = [];

  const fn = (arr, result) =>
    arr.forEach(item => {
      Array.isArray(item) ? fn(item, result) : result.push(item);
    });

  arr.forEach(item => {
    Array.isArray(item) ? fn(item, result) : result.push(item);
  });
  return result;
};
```

4. 扩展运算符

```js
const flat = arr => {
  arr = [...arr];
  while (arr.some(i => Array.isArray(i))) {
    arr = [].concat(...arr);
  }
  return arr;
};
```

5. 正则

> 依赖转换成的字符串, 限制类型

```js
arr.toString().split(/,,?/g).map(Number);

JSON.parse(JSON.stringify(arr).replace(/(?!^\[|\]$)(?:\[\]?,?|\])/g, ''));
```

## 数组去重

> 示例数组

```js
const arr = [1, 2, 2, 'abc', 'abc', true, true, undefined, undefined, NaN, NaN];
```

1. `Set`

> 基本数据类型去重

```js
Array.from(new Set(arr));
```

2. `filter`

> 注意 indexOf(NaN) = -1

```js
arr.filter((item, index) => arr.indexOf(item) === index);
```

3. `Map`

```js
const map = new Map();
arr.filter(item => !map.has(item) && map.set(item));
```

4. `includes`

```js
const result = [];
arr.forEach(item => !result.includes(item) && result.push(item));
```

5. `reduce`

```js
arr.reduce((pre, cur) => (!pre.includes(cur) ? (pre.push(cur), pre) : pre), []);
```

6. 引用数据类型去重

```js
const array = [
  { a: 1, b: 2, c: 3 },
  { b: 2, c: 3, a: 1 },
  { d: 2, c: 2 }
];

// 1. 先把对象中的key排序 再转成字符串遍历数组利用Set去重
{
  const result = [
    ...new Set(
      array
        .map(item => Object.keys(item).sort())
        .map((item, index) => {
          const obj = {};
          for (const key of item) obj[key] = array[index][key];
          return obj;
        })
        .map(item => JSON.stringify(item))
    )
  ].map(item => JSON.parse(item));
  console.log(result);
}

// 三. 更加复杂的情况
const s1 = Symbol(0),
  s2 = Symbol(0),
  ary = [
    { a: 1, b: 2, [s1]: 1 },
    { a: 1, b: 2 },
    { a: 1, b: 3 },
    { b: 1, a: 2 },
    { b: 2, a: 1, [s1]: 1 },
    { a: 1, b: 2, [s2]: 1 }
  ];

{
  // 判断是否相等
  function isEqual(val1, val2) {
    // 基础类型直接比较
    if (!isObject(val1) && !isObject(val2)) return val1 === val2;
    // 是否同类型
    if (!isSameType(val1, val2)) return false;
    // 取出复杂类型的键
    const val1keys = [...Object.keys(val1), ...Object.getOwnPropertySymbols(val1)];
    const val2Keys = [...Object.keys(val2), ...Object.getOwnPropertySymbols(val2)];
    if (val1keys.length !== val2Keys.length) return false;
    for (const key of val1keys) {
      // 键不等返回false
      if (!val2Keys.includes(key)) return false;
      // 值不等
      if (!isEqual(val1[key], val2[key])) return false;
    }
    return true;
  }

  // 判断是否是对象
  function isObject(val) {
    return typeof val === 'object' && val !== null;
  }

  // 判断是否是相同类型
  function isSameType(a, b) {
    return Object.prototype.toString.call(a) === Object.prototype.toString.call(b);
  }
  // console.log(isEqual(ary[0], ary[4]));
  // console.log(isEqual([1, 2, 3], { 0: 1, 1: 2, 2: 3 }));

  // 第一种, 根据某个键是否唯一
  const filterArrByParam = (arr, uniId = 'a') => {
    const _arr = new Map();
    return arr.filter(item => !_arr.has(item[uniId]) && _arr.set(item[uniId], 1));
  };

  // 对象数组去重 第二种
  function filterArr(arr) {
    const _arr = [...arr];
    for (let i = 0; i < _arr.length; i++) {
      for (let j = i + 1; j < _arr.length; j++) {
        if (isEqual(_arr[i], _arr[j])) {
          _arr.splice(j, 1);
          j--;
        }
      }
    }
    return _arr;
  }
  filterArr(ary);
  console.log(filterArr(ary));
}
```

## 精准查询与模糊搜索

````js
// 测试用的数据
const staff = [
    { name: "April", job: "programmer", age: 18, hobby: "study" },
    { name: "Shawn", job: "student", age: 8, hobby: "study" },
    { name: "Leo", job: "teacher", age: 28, hobby: "play" },
    { name: "Todd", job: "programmer", age: 19, hobby: "sleep" },
    { name: "Scoot", job: "cook", age: 38, hobby: "painting" },
]


// 单条件精准查找 ----------------------------------
/***
* @param {Object} lists 所有数据
* @param {string} key 需要查询的数据的键值
* @param {string} value 需要查询的值
*/
function searchKeyValue(lists, key, value) {
    return lists.filter(item => item[key] == value);
}
console.log(searchKeyValue(staff, "job", "programmer"));


// 单条件多值精准查找 --------------------------------
/**
* @param {Object} lists 所有数据
* @param {string} key 需要查询的数据的键值
* @param {Array} valueArr 需要查询的值
*/
function searchKeyValues(lists, key, valueArr) {
    return lists.filter(item =>
        valueArr.find(i => i === item[key]) !== undefined
    );
}
console.log(searchKeyValues(staff, "job", ['programmer', 'student']));



// 多条件精准查找 -----------------------------------
/**
* @param {Object} lists 所有数据
* @param {Object} filters 需要查询的数据
*/
function searchKeysValue(lists, filters) {
    const keys = Object.keys(filters);
    return lists.filter(item => {
        for (const key of keys)
            if (item[key] !== filters[key])
                return false
        return true
    })
}
console.log(searchKeysValue(staff, { name: "April", hobby: "study" }));



// 多条件多值精准查找 -----------------------------------
/**
* @param {Object} lists 所有数据
* @param {Object} filters 需要查询的数据
*/
function searchKeysValues(lists, filters) {
    const keys = Object.keys(filters)
    const filter = {}
    for (const key of keys) {
        const map = new Map();
        for (const item of filters[key]) {
            map.set(item, true)
        }
        filter[key] = map
    }
    return lists.filter(item => {
        for (const key of keys) {
            if (!filter[key].has(item[key]))
                return false
        }
        return true
    })

}
console.log(searchKeysValues(staff, {
    age: [8, 19],
    hobby: ["study", "sleep"]
}));



// includes()模糊查询  -----------------------------------
/**
* @param {Object} lists 所有数据
* @param {Object} keyWord 查询的关键词
*/
function selectMatchItem(lists, keyWord) {
    keyWord = typeof keyWord === "string" ? keyWord : keyWord.toString()
    keyWord = keyWord.toLowerCase();

    return lists.filter(item => {
        for (const val of Object.values(item)) {
            if (typeof val === "string" && val.toLowerCase().includes(keyWord))
                return true;

            if (typeof val === "number" && val.toString().includes(keyWord))
                return true;
        }
        return false;
    })
}
console.log(selectMatchItem(staff, 8));



// 正则匹配模糊查询 -----------------------------------
/**
* @param {Object} lists 所有数据
* @param {Object} keyWord 查询的关键词
*/
function selectMatchItem(lists, keyWord) {
    const reg = new RegExp(keyWord);

    return lists.filter(item => {
        for (const val of Object.values(item))
            if (reg.test(val))
                return true
    })
}
console.log(selectMatchItem(staff, 8));```
````

## 节流防抖

### `debounce` 防抖

> 事件触发后在 n 秒内函数只能执行一次，如果在 n 秒内又触发了事件，重新计算时间

- 非立即执行

```js
function debounce(func, delay) {
  let timer = null;
  return function (...args) {
    const context = this;
    if (timer !== null) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      func.apply(context, args);
    }, delay);
  };
}
```

- 立即执行

```js
function debounce(func, delay) {
  let timer = null;
  return function (...arg) {
    const context = this;
    if (timer !== null) clearTimeout(timer);
    const callNow = !timer;
    timer = setTimeout(() => {
      timer = null;
    }, delay);
    if (callNow) func.apply(context, arg);
  };
}
```

- 可控制是否立即执行

```js
/**
 * @desc 函数防抖
 * @param {Function} func 函数
 * @param {Number} wait 延迟执行毫秒数
 * @param {Boolean} immediate true 表立即执行，false 表非立即执行
 */
function debounce(func, wait, immediate) {
  let timer = null;
  return immediate
    ? function (...arg) {
        const context = this;
        if (timer !== null) clearTimeout(timer);
        const callNow = !timer;
        timer = setTimeout(() => {
          timer = null;
        }, delay);
        if (callNow) func.apply(context, arg);
      }
    : function (...arg) {
        const context = this;
        if (timer !== null) clearTimeout(timer);
        timer = setTimeout(() => {
          timer = null;
          func.apply(context, arg);
        }, wait);
      };
}
```

### `throttle` 节流

> 连续触发事件但是在 n 秒中只执行一次函数, 节流会稀释函数的执行频率

- 时间戳实现

```js
function throttle(func, wait) {
  let previous = 0;
  return function () {
    let now = Date.now();
    if (now - previous > wait) {
      previous = now;
      func.apply(this, arguments);
    }
  };
}
```

- 定时器实现

```js
function throttle(func, wait) {
  let timer = null;
  return function () {
    let context = this;
    if (timer === null) {
      timer = setTimeout(() => {
        timer = null;
        func.apply(context, arguments);
      }, wait);
    }
  };
}
```

## 深浅拷贝

1. 浅拷贝 `Object.assign` / 扩展运算符

2. 深拷贝

> JSON.parse(JSON.stringify()) 最方便
> NaN 和 infinity 会转换成 null, 且无法处理循环引用

```js
const data = {
  name: 'Jack',
  date: [new Date(1536627600000), new Date(1540047600000)],

  re: new RegExp('\\w+'),
  err: new Error('"x" is not defined'),

  func: function () {
    console.log(1);
  },
  val: undefined,
  sym: Symbol('foo'),

  nan: NaN,
  infinityMax: Infinity,

  key
};
key.key = data;

// 通过递归实现深拷贝  WeakMap 弱引用优化循环引用
function deepClone(source, map = new WeakMap()) {
  // 如果不是复杂数据类型 或者为null，直接返回
  if (typeof source !== 'object' || source === null) return source;
  if (source instanceof RegExp) return new RegExp(source);
  if (source instanceof Date) return new Date(source);
  if (source instanceof Error) return new Error(source);

  // 解决循环引用 obj[key] = obj
  if (map.has(source)) return map.get(source);
  const cloneObj = Array.isArray(source) ? [] : {};
  map.set(source, cloneObj);

  for (const key in source) {
    // 判断是否是对象自身的属性，筛掉对象原型链上继承的属性
    if (source.hasOwnProperty(key)) {
      // 如果 obj[key] 是复杂数据类型，递归
      cloneObj[key] = deepClone(source[key], map);
    }
  }
  return cloneObj;
}
```

::: tip 杂项
工作中直接使用函数库 `lodash` 里的 `cloneDeep`
:::
