# Java 知识笔记

## Stream 流

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

### 创建流

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

### 操作流

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

### 转换流

- `toArray()` 方法可以将流转换成数组
- `collect()` 方法可以将流转换成集合
- `Collectors` 是一个收集器的工具类，内置了一系列收集器实现

```java
List<String> list = new ArrayList<>();

String[] arr = list.stream().toArray(String[]::new);
List<Integer> list1 = list.stream().map(String::length).collect(Collectors.toList());
String str = list.stream().collect(Collectors.joining(", ")).toString();
```

## Optional

Optional 类提供了一种用于表示可选值而非空引用的类级别解决方案。

![alt text](/image/Java/java-optional.png)

### 创建 Optional 对象

1. 静态方法 `empty()` 创建一个空的 `Optional` 对象
2. 静态方法 `of()` 创建一个非空的 `Optional` 对象
3. 静态方法 `ofNullable()` 创建一个即可空又可非空的 `Optional` 对象

```java
Optional<String> empty = Optional.empty(); //Optional.empty

// of 方法的参数必须是非空的
Optional<String> opt = Optional.of("123"); // Optional[123]

Optional<String> optOrNull = Optional.ofNullable(null);
```

### 常用方法

1. `isPresent()` 判断值是否存在

```java
boolean bool = Optional.ofNullable(null).isPresent(); // false

// Java 11 后可以通过 isEmpty() 判断与 isPresent() 相反的结果
boolean empty = Optional.ofNullable(null).isEmpty(); // true
```

2. `ifPresent()` 非空表达式

```java
Optional.ofNullable(null).ifPresent(System.out::println);

// Java 9 后可以通过方法 ifPresentOrElse(action, emptyAction) 执行两种结果，非空时执行 action，空时执行 emptyAction。
Optional.ofNullable(null).ifPresentOrElse(str -> System.out.println(str.length()), () -> System.out.println("为空"));
```

3. `orElse()` / `orElseGet() `设置默认值

```java
Optional.ofNullable(null).orElse("Relsola");

Optional.ofNullable(null).orElseGet(() -> "Relsola");
```

::: tip
`orElseGet()` 性能更佳
:::

4. `get()` 获取值

直观从语义上来看 `get()` 方法是获取 `Optional` 对象值的方法  
但假如 `Optional` 对象的值为 `null`，该方法会抛出 `NoSuchElementException` 异常

```java
Optional<String> name = Optional.ofNullable(null);
// 这行代码会抛出异常
System.out.println(name.get());
```

5. `filter()` 过滤值

```java
Optional.ofNullable("12345").filter(str -> str.length() > 6).isPresent();
```

还可以再追加一个条件

```java
Predicate<String> len6 = pwd -> pwd.length() > 6;
Predicate<String> len10 = pwd -> pwd.length() < 10;

Optional.ofNullable("1234567").filter(len6.and(len10)).isPresent();
```

6. `map()` 转换值

```java
Optional<Integer> opt = Optional.ofNullable("Relsola").map(String::length);
```

## Lambda 表达式

Lambda 表达式描述了一个代码块（或者叫匿名方法），可以将其作为参数传递给构造方法或者普通方法以便后续执行。

### Lambda 的使用

> Lambda 语法 `( parameter-list ) -> { expression-or-statements }`

1. 为变量赋值

```java
Runnable r = () -> { System.out.println("Relsola"); };
r.run();
```

2. 作为 `return` 返回值

```java
static FileFilter getFilter(String text)
{
    return (pathname) -> pathname.toString().endsWith(text);
}
```

3. 作为数组元素

```java
final PathMatcher matchers[] =
{
    (path) -> path.toString().endsWith("txt"),
    (path) -> path.toString().endsWith("java")
};
```

4. 作为普通方法或者构造方法的参数

```java
new Thread(() -> System.out.println("Relsola")).start();
```

### `Lambda` 表达式的作用域范围

- `Lambda` 表达式并不会引入新的作用域，这一点和匿名内部类是不同的  
  也就是说，`Lambda` 表达式主体内使用的 `this` 关键字和其所在的类实例相同

- `Lambda` 表达式中要用到的，但又未在 `Lambda` 表达式中声明的变量  
  必须声明为 `final` 或者是 `effectively final`，否则就会出现编译错误

在 `Lambda` 表达式中修改变量的值

1. 把变量声明为 `static`
2. 把变量声明为 `AtomicInteger` 使用 `set()` 和 `get()`
3. 使用数组

## 异常处理最佳实践

1. 尽量不要捕获 `RuntimeException`

> 尽量不要 catch RuntimeException，比如 NullPointerException、IndexOutOfBoundsException 等等，应该用预检查的方式来规避。

```java
if (obj != null) {
    //...
}
```

2. 尽量使用 `try-with-resource` 来关闭资源

> 当需要关闭资源时，尽量不要使用 try-catch-finally，禁止在 try 块中直接关闭资源。

```java
try (FileInputStream inputStream = new FileInputStream(file);) {
} catch (FileNotFoundException e) {
    log.error(e);
} catch (IOException e) {
    log.error(e);
}

// 没有实现 AutoCloseable 接口，在 finally 块关闭流
try {
    File file = new File("./hello.txt");
    inputStream = new FileInputStream(file);
} catch (FileNotFoundException e) {
    log.error(e);
} finally {
    if (inputStream != null) {
        try {
            inputStream.close();
        } catch (IOException e) {
            log.error(e);
        }
    }
}
```

3. 不要捕获 `Throwable`

> `Throwable` 是 `exception` 和 `error` 的父类，如果在 `catch` 子句中捕获了 `Throwable`，很可能把超出程序处理能力之外的错误也捕获了。

```java
// 不要这样做
try {
} catch (Throwable t) {
    // ...
}
```

## Java 常用工具类

1. `StringUtils`

```xml
<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-lang3</artifactId>
    <version>3.12.0</version>
</dependency>
```

2. `Hutool`

```xml
<dependency>
    <groupId>cn.hutool</groupId>
    <artifactId>hutool-all</artifactId>
    <version>5.4.3</version>
</dependency>
```

### Objects

### Hutool

### Guava

## Java 注解
