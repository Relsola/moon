# 用户体验

## 使用事件委托

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
