---
outline: [2, 3]
---

# Java 开发

## Java 基础

### Stream 流

流的操作可以分为两种类型：

1. 中间操作，每次返回一个新的流，可进行链式操作。
2. 终端操作，放在最后。

```java
List<String> list = new ArrayList<>();
long count = list.stream().distinct().count();
```

`distinct()` 方法是一个中间操作（去重），它会返回一个新的流（没有共同元素）。  
`count()` 方法是一个终端操作，返回流中的元素个数。

::: tip
中间操作不会立即执行，只有等到终端操作的时候，流才开始真正地遍历，用于映射、过滤等。  
通俗点说，就是一次遍历执行多个操作，性能就大大提高了。
:::

#### 创建流

数组使用 `Arrays.stream()` 或者 `Stream.of()` 创建流  
集合直接使用 `stream()` 方法创建流，因为该方法已经添加到 Collection 接口中

```java
String[] arr = new String[]{"1", "2", "3"};
Stream<String> stream = Arrays.stream(arr);

stream = Stream.of("1", "2", "3");

List<String> list = new ArrayList<>();
stream = list.stream();
```

查看 `Stream` 源码，发现 `of()` 方法内部其实调用了 `Arrays.stream()` 方法。

```java
public static<T> Stream<T> of(T... values) {
    return Arrays.stream(values);
}
```

集合还可以调用 `parallelStream()` 方法创建并发流  
默认使用的是 `ForkJoinPool.commonPool()` 线程池。

```java
List<Long> list = new ArrayList<>();
Stream<Long> parallelStream = list.parallelStream();
```

#### 操作流

`Stream` 类提供了很多有用的操作流的方法。

1. `filter()` 过滤

```java
List<String> list = new ArrayList<>();
Stream<String> stream = list.stream().filter(str -> str.contains("1"));
```

2. `map()` 映射

```java
List<String> list = new ArrayList<>();
Stream<Integer> stream = list.stream().map(String::length);
```

3.  匹配

Stream 类提供了三个方法可供进行元素匹配，它们分别是：

- `anyMatch()` 只要有一个元素匹配就返回 `true`
- `allMatch()` 全部匹配返回 `true`
- `noneMatch()` 全部不匹配返回 `true`

```java
List<String> list = new ArrayList<>();
boolean  anyMatchFlag = list.stream().anyMatch(item -> item.contains("1"));
boolean  allMatchFlag = list.stream().allMatch(item -> item.length() > 1);
boolean  noneMatchFlag = list.stream().noneMatch(item -> item.endsWith("1"));
```

4. `reduce()` 组合

```java
Integer[] nums = {0, 1, 2, 3};
List<Integer> list = Arrays.asList(nums);

// 没有起始值，返回 Optional。
Optional<Integer> optional = list.stream().reduce((a, b) -> a + b);
Optional<Integer> optional1 = list.stream().reduce(Integer::sum);

// 有起始值，返回的类型和起始值类型一致。
int reduce = list.stream().reduce(6, (a, b) -> a + b);
int reduce1 = list.stream().reduce(6, Integer::sum);
```

#### 转换流

- `toArray()` 方法可以将流转换成数组
- `collect()` 方法可以将流转换成集合
- `Collectors` 是一个收集器的工具类，内置了一系列收集器实现

```java
List<String> list = new ArrayList<>();

String[] arr = list.stream().toArray(String[]::new);
List<Integer> list1 = list.stream().map(String::length).collect(Collectors.toList());
String str = list.stream().collect(Collectors.joining(", ")).toString();
```

## Java 进阶

## 新版本特性

## JVM 相关
