# 位运算

位运算就是基于整数的二进制表示进行的运算。  
由于计算机内部就是以二进制来存储数据，位运算是相当快的。  
这里以 JavaScript 代码示例

## 进位制

## 位运算类型

基本的位运算共 6 种，分别为按位与、按位或、按位异或、按位取反、左移和右移。

### 按位非 `～`

按位非操作符用波浪符 `~` 表示，它的作用是返回数值的一补数。  
按位非的最终效果是对 数值取反并减 1

```js
let num1 = 25; // 二进制 00000000000000000000000000011001
let num2 = ~num1; // 二进制 11111111111111111111111111100110
console.log(num2); // -26

let a = -10;
console.log(~a + 1); // 10
```

### 按位与 `&`

按位与操作在两个位都是 1 时返回 1，在任何一位是 0 时返回 0

| 第一位 | 第二位 | 结果 |
| :----: | :----: | :--: |
|   1    |   1    |  1   |
|   1    |   0    |  0   |
|   0    |   1    |  0   |
|   0    |   0    |  0   |

```js
let res = 25 & 3;
console.log(res); // 1
```

> 25 = 0000 0000 0000 0000 0000 0000 0001 1001  
>  3 = 0000 0000 0000 0000 0000 0000 0000 0011  
> res = 0000 0000 0000 0000 0000 0000 0000 0001

### 按位或 `|`

按位或操作在至少一位是 1 时返回 1，两位都是 0 时返回 0

| 第一位 | 第二位 | 结果 |
| :----: | :----: | :--: |
|   1    |   1    |  1   |
|   1    |   0    |  1   |
|   0    |   1    |  1   |
|   0    |   0    |  0   |

```js
let result = 25 | 3;
console.log(result); // 27
```

> 25 = 0000 0000 0000 0000 0000 0000 0001 1001  
>  3 = 0000 0000 0000 0000 0000 0000 0000 0011  
> res= 0000 0000 0000 0000 0000 0000 0001 1011

### 按位异或 `^`

按位异或只在一位上是 1 的时候返回 1, 两位都是 1 或 0，则返回 0

| 第一位 | 第二位 | 结果 |
| :----: | :----: | :--: |
|   1    |   1    |  0   |
|   1    |   0    |  1   |
|   0    |   1    |  1   |
|   0    |   0    |  0   |

```js
let result = 25 ^ 3;
console.log(result); // 26
```

> 25 = 0000 0000 0000 0000 0000 0000 0001 1001  
>  3 = 0000 0000 0000 0000 0000 0000 0000 0011  
>  res= 0000 0000 0000 0000 0000 0000 0001 1010

### 左移 `<<`

左移会将数值向左移动，以 0 填充空位，保留它所操作数值的符号（正或负）

```js
let oldValue = 2; // 二进制 10
let newValue = oldValue << 5; // 二进制 1000000
console.log(newValue); // 64
```

### 有符号右移 `>>`

将数值的所有 32 位都向右移，同时保留符号（正或负）  
有符号右移实际上是左移的逆运算

```js
let oldValue = 64; // 二进制 1000000
let newValue = oldValue >> 5; // 二进制 10
console.log(newValue); // 2
```

### 无符号右移 `>>>`

将数值的所有 32 位都向右移  
对于正数，无符号右移与 有符号右移结果相同  
对于负数，无符号右移会给空位补 0，有时候差异会非常大

```js
console.log(64 >>> 5); //2

let oldValue = -64; // 二进制 11111111111111111111111111000000
let newValue = oldValue >>> 5; // 二进制 00000111111111111111111111111110
console.log(newValue); // 134 217 726。
```

## 位运算实践

### 判断奇偶数

> 偶数 & 1 = 0 奇数 & 1 = 1

```js
console.log(2 & 1); // 0
console.log(3 & 1); // 1
```

### 使用 `^` 交换值

```js
let a = 2;
let b = 5;
a ^= b;
b ^= a;
a ^= b;
console.log(a, b); // 5 2
```

### 使用 `~` 进行判断

```js
if (arr.indexOf(2) > -1) {
  // ...
}

if (~arr.indexOf(3)) {
  // ...
}
```

### rgb 值和 16 进制颜色值之间的转换

```js
/**
 * 16进制颜色值转RGB
 *
 * @param  {String} color 16进制颜色字符串
 * @return {String}     RGB颜色字符串
 */
function hexToRGB(color) {
  color = color.replace('#', '0x');
  const r = color >> 16;
  const g = (color >> 8) & 0xff;
  const b = color & 0xff;
  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * RGB颜色转16进制颜色
 * @param  {String} rgb RGB进制颜色字符串
 * @return {String}     16进制颜色字符串
 */
function RGBToHex(rgb) {
  var rgbArr = rgb.split(/[^\d]+/);
  var color = (rgbArr[1] << 16) | (rgbArr[2] << 8) | rgbArr[3];
  return '#' + color.toString(16);
}
```

### 数学计算

```js
// ~~ 取整
console.log(~~3.1415); // 3

// 除2 奇数会向下取整
console.log(5 >> 1); // 2
console.log(4 >> 1); // 2

// 乘2
console.log(5 << 1); // 10
console.log(4 << 1); // 8
```

### 切换 0 和 1

```js
let toggle = 0;
toggle = toggle ? 0 : 1;

toggle ^= 1;
```

## 位运算权限设计

设计权限

```js
let r = 0b100; // 4 读
let w = 0b010; // 2 写
let x = 0b001; // 1 执行
```

### 添加权限

```js
// 给用户赋全部权限（ | ）
let user = r | w | x; // 0b111
```

### 校验权限

```js
// 给用户赋 r w 两个权限
let user = r | w; // 0b110

console.log((user & r) === r); // true  有 r 权限
console.log((user & w) === w); // true  有 w 权限
console.log((user & x) === x); // false 没有 x 权限
```

### 删除权限

```js
// 给用户赋 r w 两个权限
let user = r | w; // 0b110

// 执行异或操作，删除 r 权限
user = user ^ r;

console.log((user & r) === r); // false 没有 r 权限
console.log((user & w) === w); // true  有 w 权限
console.log((user & x) === x); // false 没有 x 权限

// 再执行一次异或操作，添加 r 权限
user = user ^ r;

console.log((user & r) === r); // true  有 r 权限
console.log((user & w) === w); // true  有 w 权限
console.log((user & x) === x); // false 没有 x 权限

// 那么如果单纯的想删除权限（而不是无则增，有则减）执行 &(~code)，先取反，再执行与操作
user = user & ~r;
```

### 局限性和解决办法

上述的所有都有前提条件：

1. 每种权限码都是唯一的
2. 每个权限码的二进制数形式，有且只有一位值为 1（2^n）

也就是说，权限码只能是 1, 2, 4, 8,...,1024,...  
而上文提到，一个数字的范围只能在 -(2^53 -1) 和 2^53 -1 之间  
JavaScript 的按位操作符又是将其操作数当作 32 位比特序列的  
那么同一个应用下可用的权限数就非常有限了。这也是该方案的局限性。

为了突破这个限制，这里提出一个叫 `权限空间` 的概念  
既然权限数有限，那么不妨就多开辟几个空间来存放  
基于权限空间，我们定义两个格式

1. 权限 code，字符串形如 index,pos。其中 pos 表示 32 位二进制数中 1 的位置（其余全是 0）； index 表示权限空间，用于突破 JavaScript 数字位数的限制，是从 0 开始的正整数，每个权限 code 都要归属于一个权限空间。index 和 pos 使用英文逗号隔开。

2. 用户权限，字符串，形如 1,16,16。英文逗号分隔每一个权限空间的权限值。例如 1,16,16 的意思就是，权限空间 0 的权限值是 1，权限空间 1 的权限值是 16，权限空间 2 的权限是 16。

```js
{
  // 用户的权限 code
  let userCode = '';

  // 假设系统里有这些权限
  // 纯模拟，正常情况下是按顺序的如 0,0 0,1 0,2 ... 尽可能占满一个权限空间再使用下一个
  const permissions = {
    SYS_SETTING: {
      value: '0,0', // index = 0, pos = 0
      info: '系统权限'
    },
    DATA_ADMIN: {
      value: '0,8',
      info: '数据库权限'
    },
    USER_ADD: {
      value: '0,22',
      info: '用户新增权限'
    },
    USER_EDIT: {
      value: '0,30',
      info: '用户编辑权限'
    },
    USER_VIEW: {
      value: '1,2', // index = 1, pos = 2
      info: '用户查看权限'
    },
    USER_DELETE: {
      value: '1,17',
      info: '用户删除权限'
    },
    POST_ADD: {
      value: '1,28',
      info: '文章新增权限'
    },
    POST_EDIT: {
      value: '2,4',
      info: '文章编辑权限'
    },
    POST_VIEW: {
      value: '2,19',
      info: '文章查看权限'
    },
    POST_DELETE: {
      value: '2,26',
      info: '文章删除权限'
    }
  };

  // 添加权限
  const addPermission = (userCode, permission) => {
    const userPermission = userCode ? userCode.split(',') : [];
    const [index, pos] = permission.value.split(',');

    userPermission[index] = (userPermission[index] || 0) | Math.pow(2, pos);

    return userPermission.join(',');
  };

  // 删除权限
  const delPermission = (userCode, permission) => {
    const userPermission = userCode ? userCode.split(',') : [];
    const [index, pos] = permission.value.split(',');

    userPermission[index] = (userPermission[index] || 0) & ~Math.pow(2, pos);

    return userPermission.join(',');
  };

  // 判断是否有权限
  const hasPermission = (userCode, permission) => {
    const userPermission = userCode ? userCode.split(',') : [];
    const [index, pos] = permission.value.split(',');
    const permissionValue = Math.pow(2, pos);

    return (userPermission[index] & permissionValue) === permissionValue;
  };

  // 列出用户拥有的全部权限
  const listPermission = userCode => {
    const results = [];

    if (!userCode) {
      return results;
    }

    Object.values(permissions).forEach(permission => {
      if (hasPermission(userCode, permission)) {
        results.push(permission.info);
      }
    });

    return results;
  };

  const log = () => {
    console.log(`userCode: ${JSON.stringify(userCode, null, ' ')}`);
    console.log(`权限列表: ${listPermission(userCode).join('; ')}`);
    console.log('');
  };

  userCode = addPermission(userCode, permissions.SYS_SETTING);
  log();
  // userCode: "1"
  // 权限列表: 系统权限

  userCode = addPermission(userCode, permissions.POST_EDIT);
  log();
  // userCode: "1,,16"
  // 权限列表: 系统权限; 文章编辑权限

  userCode = addPermission(userCode, permissions.USER_EDIT);
  log();
  // userCode: "1073741825,,16"
  // 权限列表: 系统权限; 用户编辑权限; 文章编辑权限

  userCode = addPermission(userCode, permissions.USER_DELETE);
  log();
  // userCode: "1073741825,131072,16"
  // 权限列表: 系统权限; 用户编辑权限; 用户删除权限; 文章编辑权限

  userCode = delPermission(userCode, permissions.USER_EDIT);
  log();
  // userCode: "1,131072,16"
  // 权限列表: 系统权限; 用户删除权限; 文章编辑权限

  userCode = delPermission(userCode, permissions.USER_EDIT);
  log();
  // userCode: "1,131072,16"
  // 权限列表: 系统权限; 用户删除权限; 文章编辑权限

  userCode = delPermission(userCode, permissions.USER_DELETE);
  userCode = delPermission(userCode, permissions.SYS_SETTING);
  userCode = delPermission(userCode, permissions.POST_EDIT);
  log();
  // userCode: "0,0,0"
  // 权限列表:

  userCode = addPermission(userCode, permissions.SYS_SETTING);
  log();
  // userCode: "1,0,0"
  // 权限列表: 系统权限
}
```

除了通过引入权限空间的概念突破二进制运算的位数限制，还可以使用 math.js 的 bigNumber，直接运算超过 32 位的二进制数，具体可以看它的文档，这里就不细说了。

如果按照当前使用最广泛的 RBAC 模型设计权限系统，那么一般会有这么几个实体：应用，权限，角色，用户。用户权限可以直接来自权限，也可以来自角色：

一个应用下有多个权限  
权限和角色是多对多的关系  
用户和角色是多对多的关系  
用户和权限是多对多的关系

在此种模型下，一般会有用户与权限，用户与角色，角色与权限的对应关系表。想象一个商城后台权限管理系统，可能会有上万，甚至十几万店铺（应用），每个店铺可能会有数十个用户，角色，权限。随着业务的不断发展，刚才提到的那三张对应关系表会越来越大，越来越难以维护。
而进制转换的方法则可以省略对应关系表，减少查询，节省空间。当然，省略掉对应关系不是没有坏处的，例如下面几个问题：

如何高效的查找我的权限？  
如何高效的查找拥有某权限的所有用户？  
如何控制权限的有效期？

所以进制转换的方案比较适合刚才提到的应用极其多，而每个应用中用户，权限，角色数量较少的场景。

其他方案

除了二进制方案，当然还有其他方案可以达到类似的效果，例如直接使用一个 1 和 0 组成的字符串，权限点对应 index，1 表示拥有权限，0 表示没有权限。举个例子：添加 0、删除 1、编辑 2，用户 A 拥有添加和编辑的权限，则 userCode 为 101；用户 B 拥有全部权限，userCode 为 111。这种方案比二进制转换简单，但是浪费空间。
还有利用质数的方案，权限点全部为质数，用户权限为他所拥有的全部权限点的乘积。如：权限点是 2、3、5、7、11，用户权限是 5 _ 7 _ 11 = 385。这种方案麻烦的地方在于获取质数（新增权限点）和质因数分解（判断权限），权限点特别多的时候就快成 RSA 了，如果只有增删改查个别几个权限，倒是可以考虑。
