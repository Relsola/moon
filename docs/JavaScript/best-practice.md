---
outline: [2, 3]
---

# 前端最佳实践

## JavaScript 代码优化

### 使用 IIFE

在 JavaScript 中，我们可以使用自执行函数（Immediately-invoked Function Expression）IIFE 将代码放入一个函数中，来创建一个私有作用域，防止变量污染全局作用域和其他代码模块。

```js
(function () {
  // 这里是私有作用域
  // ...
})();
```

### 使用事件委托

在 JavaScript 中，事件委托是一种优化性能的常用方式，它可以将事件处理程序绑定到它们的共同父元素上，而不是绑定到每个子元素上。这样可以减少事件处理程序的数量，避免内存泄漏，提高页面的响应速度。

```js
const tbody = document.querySelector('tbody');
tbody.addEventListener('click', function (event) {
  const target = event.target;
  if (target.matches('td.deleteButton')) {
    const row = target.closest('tr');
    row.remove();
  }
});
```

## 用户体验优化
