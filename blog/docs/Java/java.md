# Java 知识笔记

> 记录自己学习常见问题  
> Java 学习网站推荐 ==>  
> https://javabetter.cn/  
> https://javaguide.cn/home.html  
> https://pdai.tech/

## Stream 流

> Java 8

流的操作可以分为两种类型：

1）中间操作，可以有多个，每次返回一个新的流，可进行链式操作。

2）终端操作，只能有一个，每次执行完，这个流也就用光光了，无法执行下一个操作，因此只能放在最后。

```java
List<String> list = new ArrayList<>();
list.add("武汉加油");
list.add("中国加油");
list.add("世界加油");
list.add("世界加油");

long count = list.stream().distinct().count();
System.out.println(count);
```

distinct() 方法是一个中间操作（去重），它会返回一个新的流（没有共同元素）。

```java
Stream<T> distinct();
```

count() 方法是一个终端操作，返回流中的元素个数。

```java
long count();
```

中间操作不会立即执行，只有等到终端操作的时候，流才开始真正地遍历，用于映射、过滤等。通俗点说，就是一次遍历执行多个操作，性能就大大提高了。

## Optional

## Lambda 表达式

## 异常处理

## Java 常用工具类

## 并发编程

## Java 注解
