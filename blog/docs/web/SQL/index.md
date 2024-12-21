# SQL 语言

## 查询数据

1. 基本查询

```sql
SELECT * FROM <表名>
```

:::tip `SELECT` 语句其实并不要求一定要有 `FROM` 子句

```sql
-- 计算 100 + 200
SELECT 100 + 200;
```

虽然 SELECT 可以用作计算，但它并不是 SQL 的强项  
不带 FROM 子句的 SELECT 语句有一个有用的用途，就是用来判断当前到数据库的连接是否有效  
许多检测工具会执行一条 `SELECT 1;` 来测试数据库连接。
:::

2. 条件查询

> 通过 `WHERE` 关键字来设定查询条件

```sql
SELECT * FROM <表名> WHERE <条件表达式>
```

- 不加括号 条件运算按照 `NOT`、`AND`、`OR` 的优先级进行

- 常用的条件表达式

| 条件   | 表达式举例          | 说明           |
| ------ | :------------------ | :------------- |
| `=`    | `name = 'abc'`      | 判断相等       |
| `>`    | `name > 'abc'`      | 判断大于       |
| `>=`   | `name >= 'abc'`     | 判断大于或相等 |
| `<`    | `name < 'abc'`      | 判断小于       |
| `<=`   | `name <= 'abc'`     | 判断小于或相等 |
| `<>`   | `name <> 'abc'`     | 判断不相等     |
| `LIKE` | `name LIKE '_abc%'` | 判断判断相似   |

> `LIKE` 操作符支持使用通配符来进行字符串匹配  
> `%` 匹配零个或多个字符, `_` 匹配单个字符

3. 投影查询

> 投影查询让结果集仅包含指定列

```sql
SELECT <列1, 列2, 列3 ...> FROM <表名> WHERE <条件表达式>
```

4. 排序

> 查询结果集通常是按照主键排序 加上 `ORDER BY` 子句根据其他条件排进行排序  
> 加上 `DESC` 表示 倒序  
> 要进一步排序，可以继续添加列名

```sql
-- 带WHERE条件的ORDER BY:
SELECT id, name, gender, score
FROM students
WHERE score < 60
ORDER BY score DESC, gender;
```

5. 分页查询

> 通过 `LIMIT <N-M> OFFSET <M>` 子句实现

```sql
-- 结果集分页，每页3条记录，获取第1页的记录
SELECT id, name, gender, score
FROM students
ORDER BY score DESC
LIMIT 3 OFFSET 0;

-- 如果要查询第2页，需要跳过头3条记录，对结果集从3号记录开始查询，把OFFSET设定为3
SELECT id, name, gender, score
FROM students
ORDER BY score DESC
LIMIT 3 OFFSET 3;
```

::: tip 注意
`LIMIT` 总是设定为 pageSize, `OFFSET` 计算公式为 `pageSize * (pageIndex - 1)`  
`OFFSET` 是可选的，如果只写 `LIMIT 15`，那么相当于 `LIMIT 15 OFFSET 0`  
在 `MySQL` 中，`LIMIT 15 OFFSET 30` 还可以简写成 `LIMIT 30, 15`
:::

6. 聚合查询

> 对于统计总数、平均数这类计算，SQL 提供了专门的聚合函数

```sql
-- 使用聚合查询:
SELECT COUNT(*) FROM students;

-- 使用聚合查询并设置结果集的列名为 num
SELECT COUNT(*) num FROM students;

-- 使用聚合查询并设置WHERE条件
SELECT COUNT(*) boys FROM students WHERE gender = 'M';
```

- 常用的聚合函数

| 函数  | 说明                                   |
| ----- | :------------------------------------- |
| `SUM` | 计算某一列的合计值，该列必须为数值类型 |
| `AVG` | 计算某一列的平均值，该列必须为数值类型 |
| `MAX` | 计算某一列的最大值                     |
| `MIN` | 计算某一列的最小值                     |

> 如果是字符类型，MAX() 和 MIN() 会返回排序最后和排序最前的字符  
> 如果聚合查询的 WHERE 条件没有匹配到任何行  
> COUNT() 会返回 0 而 SUM()、AVG()、MAX()和 MIN()会返回 NULL

## 修改数据
