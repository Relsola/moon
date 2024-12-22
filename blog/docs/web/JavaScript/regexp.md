<script setup>
import Regex from '@components/Regex/index.vue'
</script>

# 正则表达式

<Regex />

## 正则表达式字符匹配

正则表达式是匹配模式，要么匹配字符，要么匹配位置。

### 两种模糊匹配

1. 横向模糊匹配  
   横向模糊指的是，一个正则可匹配的字符串的长度不是固定的，可以是多种情况的。  
   其实现的方式是使用量词。譬如 `{m,n}` ，表示连续出现最少 m 次，最多 n 次。

```js
const regex = /ab{2,5}c/g;
const string = 'abc abbc abbbc abbbbc abbbbbc abbbbbbc';
console.log(string.match(regex)); // [ 'abbc', 'abbbc', 'abbbbc', 'abbbbbc' ]
```

2. 纵向模糊匹配  
   纵向模糊指的是，一个正则匹配的字符串，具体到某一位字符时，它可以不是某个确定的字符，可以有多种可能。  
   其实现的方式是使用字符组。譬如[abc]，表示该字符是可以字符 "a"、"b"、"c" 中的任何一个。

```js
const regex = /a[123]b/g;
const string = 'a0b a1b a2b a3b a4b';
console.log(string.match(regex)); // ["a1b", "a2b", "a3b"]
```

### 字符组 虽叫字符组（字符类），但只是其中一个字符

1. 范围表示法  
   `[1-6a-fG-M]` 用连字符-来省略和简写  
    因为连字符有特殊用途，那么要匹配 "a"、"-"、"z" 这三者中任意一个字符  
    可以写成 `[-az]` 或 `[az-]` 或 `[a\-z]` 即要么放在开头，要么放在结尾，要么转义。

2. 排除字符组  
   `[^abc]`，表示是一个除 "a"、"b"、"c" 之外的任意一个字符。  
   字符组的第一位放^（脱字符），表示求反的概念。

3. 常见的简写形式
   - `\d` ==> `[0-9]`
   - `\D` ==> `[^0-9]`
   - `\w` ==> `[0-9a-zA-Z_]`
   - `\W` ==> `[^0-9a-zA-Z_]`
   - `\s` ==> `[ \t\v\n\r\f]`
   - `\S` ==> `[^ \t\v\n\r\f]`
   - 匹配任意字符 ==> `[\d\D]、[\w\W]、[\s\S]` 和 `[^]`

### 量词 量词也称重复。\{m,n\}

1. 简写形式  
   `{m,}` 至少出现 m 次  
   {m} 等价于{m,m}，表示出现 m 次  
   ? 等价于{0,1}，表示出现或者不出现 + 等价于{1,}，表示出现至少一次  
   等价于{0,}，表示出现任意次，有可能不出现

2. 贪婪匹配和惰性匹配  
   通过在量词后面加个问号就能实现惰性匹配  
   {m,n}? {m,}? ?? +? \_?

```js
const regex = /\d{2,5}/g;
const string = '123 1234 12345 123456';
console.log(string.match(regex)); // ["123", "1234", "12345", "12345"]

const regex = /\d{2,5}?/g;
const string = '123 1234 12345';
console.log(string.match(regex)); // ["12", "12", "34", "12", "34"]
```

### 多选分支

一个模式可以实现横向和纵向模糊匹配。而多选分支可以支持多个子模式任选其一  
分支结构是惰性的，即当前面的匹配上了，后面的就不再尝试了

```js
const regex = /good|nice/g;
const string = 'good idea, nice try.';
console.log(string.match(regex)); // ["good", "nice"]

const regex = /good|goodbye/g;
const string = 'goodbye';
console.log(string.match(regex)); // ["good"]

const regex = /goodbye|good/g;
const string = 'goodbye';
console.log(string.match(regex)); // ["goodbye"]
```

### 案例

#### 匹配 16 进制颜色值

```js
// #ffbbad #Fc01DF #FFF #ffE
const regex = /#([a-fA-F0-9]{3}|[a-fA-F0-9]{6})/g;
const string = '#ffbbad #Fc01DF #FFF #ffE';
console.log(string.match(regex));
```

#### 匹配时间

```js
//  23:59 02:07
const regex = /^(0?\d|1\d|2[0-3]):(0?\d|[1-5]\d)$/;
console.log(regex.test('23:59'), regex.test('02:07'), regex.test('7:9'));
```

#### 匹配日期

```js
//  2017-06-10
const regex = /^\d{4}-(0\d|1[0-2])-(0[1-9]|[12]\d|3[01])/g;
console.log(regex.test('2017-06-10'));
```

#### window 操作系统文件路径

```js
// F:\study\javascript\regex\regular expression.pdf
// F:\study\javascript\regex\
// F:\study\javascript
// F:\

const regex = /^[a-zA-Z]:\\([^\\:*<>|"?\r\n/]+\\)_([^\\:_<>|"?\r\n/]+)?$/;
console.log(regex.test('F:\\study\\javascript\\regex\\regular expression.pdf'));
console.log(regex.test('F:\\study\\javascript\\regex\\'));
console.log(regex.test('F:\\study\\javascript'));
console.log(regex.test('F:\\'));
```

#### 匹配 id

```js
// <div id="container" class="main"></div>
// const regex = /id="._?"/g
const regex = /id="[^"]_"/g;
const string = '<div id="container" class="main"></div>';
console.log(string.match(regex));
```

## 正则表达式位置匹配

在 ES5 中，共有 6 个锚字符：^ $ \b \B (?=p) (?!p)

### `^` 和 `$`

`^`（脱字符）匹配开头，在多行匹配中匹配行开头。  
`$`（美元符号）匹配结尾，在多行匹配中匹配行结尾。

```js
// 把字符串的开头和结尾用"#"替换（位置可以替换成字符的！）
const result = 'hello'.replace(/^|$/g, '#');
console.log(result);

// 多行匹配模式时，二者是行的概念
const result = 'I\nlove\njavascript'.replace(/^|$/gm, '#');
console.log(result);
```

### `\b` 和 `\B`

`\b` 是单词边界，具体就是 `\w` 和 `\W` 之间的位置，也包括 `\w` 和 `^ \w` 和 `$` 之间的位置。
`\B` 就是 `\b` 的反面的意思，非单词边界。`\w` 与 `\w` 、`\W` 与 `\W` 、`^` 与`\W`，`\W` 与 `$` 之间的位置。

```js
const result = '[JS] Lesson_01.mp4'.replace(/\b/g, '#');
console.log(result); // [#JS#] #Lesson_01#.#mp4#

const result = '[JS] Lesson*01.mp4'.replace(/\B/g, '#');
console.log(result);
// => "#[J#S]# L#e#s#s#o#n#*#0#1.m#p#4"
```

### (?=exp) 和 (?!exp)

`(?=exp)` 其中 p 是一个子模式，即 p 前面的位置。  
`(?!exp)` 就是 `(?=exp)` 的反面意思

ES6 中，还支持 positive lookbehind 和 negative lookbehind  
具体是 `(?<=exp)` 和 `(?<!exp)`

```js
const result = 'hello'.replace(/(?=l)/g, '#');
console.log(result); // "he#l#lo"

const result = 'hello'.replace(/(?!l)/g, '#');
console.log(result); // "#h#ell#o#"
```

位置的特性 对于位置的理解，我们可以理解成空字符  
比如 `"hello"` 字符串等价于如下的形式：

```js
console.log('hello' === '' + 'h' + '' + 'e' + '' + 'l' + '' + 'l' + 'o' + '');
console.log('hello' === '' + '' + 'hello');

// 因此，把/^hello$/写成/^^hello?$/，是没有任何问题的
const result = /^^hello?$/.test('hello');
console.log(result); // true

// 甚至可以写成更复杂的
const result = /(?=he)^^he(?=\w)llo$\b\b$/.test('hello');
console.log(result); // true
```

### 相关案例

#### 不匹配任何东西的正则

```js
const regex = /.^/;
// 因为此正则要求只有一个字符，但该字符后面是开头。
```

#### 数字的千位分隔符表示法 "12345678" -> "12,345,678"

```js
const regex = /\B(?=(\d{3})+\b)/g;
const string = '12345678 123456789';
console.log(string.replace(regex, ','));
```

#### 验证密码问题

```js
// 密码长度 6-12 位，由数字、小写字符和大写字母组成，但必须至少包括 2 种字符。
const reg =
  /((?=._[0-9])(?=._[a-z])|(?=._[0-9])(?=._[A-Z])|(?=._[a-z])(?=._[A-Z]))^[0-9A-Za-z]{6,12}$/;
const regex =
  /(?!^[0-9]{6,12}$)(?!^[a-z]{6,12}$)(?!^[A-Z]{6,12}$)^[0-9A-Za-z]{6,12}$/;
console.log(reg.test('1234567')); // false 全是数字
console.log(reg.test('abcdef')); // false 全是小写字母
console.log(reg.test('ABCDEFGH')); // false 全是大写字母
console.log(reg.test('ab23C')); // false 不足 6 位
console.log(reg.test('ABCDEF234')); // true 大写字母和数字
console.log(reg.test('abcdEF234')); // true 三者都有
```

## 正则表达式括号的作用

```js
/* 
  括号的作用
    1. 分组和分支结构
    2. 捕获分组
    3. 反向引用
    4. 非捕获分组
*/

// 1. 分组和分支结构
{
  // 分组
  const regex = /(ab)+/g;
  const string = 'ababa abbb ababab';
  console.log(string.match(regex)); // ["abab", "ab", "ababab"]
}

{
  // 分支结构
  const regex = /^I love (JavaScript|Regular Expression)$/;
  console.log(regex.test('I love JavaScript')); // true
  console.log(regex.test('I love Regular Expression')); // true
}

// 2. 引用分组  进行数据提取，以及更强大的替换操作
{
  const regex = /(\d{4})-(\d{2})-(\d{2})/;
  const string = '2017-06-12';

  regex.test(string); // 正则操作即可，例如
  //regex.exec(string);
  //string.match(regex);

  console.log(RegExp.$1); // "2017"
  console.log(RegExp.$2); // "06"
  console.log(RegExp.$3); // "12"

  const [, year, month, day] = regex.exec(string);
  console.log(month + '/' + day + '/' + year);

  console.log(string.replace(regex, '$2/$3/$1'));
}

// 3. 反向引用
{
  const regex = /\d{4}(-|\/|\.)\d{2}\1\d{2}/;
  const string1 = '2017-06-12';
  const string2 = '2017/06/12';
  const string3 = '2017.06.12';
  const string4 = '2016-06/12';
  console.log(regex.test(string1)); // true
  console.log(regex.test(string2)); // true
  console.log(regex.test(string3)); // true
  console.log(regex.test(string4)); // false
}

{
  // 括号嵌套以左括号（开括号）为准
  const regex = /^((\d)(\d(\d)))\1\2\3\4$/;
  const string = '1231231233';
  console.log(regex.test(string)); // true
  console.log(RegExp.$1); // 123
  console.log(RegExp.$2); // 1
  console.log(RegExp.$3); // 23
  console.log(RegExp.$4); // 3
}

{
  // 引用不存在的分组 此时正则不会报错，只是匹配反向引用的字符本身
  const regex = /\1\2\3\4\5\6\7\8\9/;
  console.log(regex.test('\1\2\3\4\5\6\789'));
  console.log('\1\2\3\4\5\6\789'.split(''));
}

// 4. 非捕获分组
// 如果只想要括号最原始的功能，但不会引用它，即既不在API里引用，也不在正则里反向引用。此时可以使用非捕获分组(?: p)
{
  const regex = /(?:ab)+/g;
  const string = 'ababa abbb ababab';
  console.log(string.match(regex)); // ["abab", "ab", "ababab"]
}

// 相关案例
{
  // 字符串trim方法模拟  去掉字符串的开头和结尾的空白符
  String.prototype.trim = function () {
    // return this.valueOf().replace(/^\s*(.*?)\s*$/g,"$1");
    return this.valueOf().replace(/^\s+|\s+$/g, '');
  };
  console.log('  foobar  '.trim());
}

{
  // 将每个单词的首字母转换为大写
  String.prototype.titleSize = function () {
    return this.valueOf()
      .toLowerCase()
      .replace(/(?:^|\s)\w/g, c => c.toUpperCase());
  };
  console.log('my name is tom'.titleSize());
}

{
  // 驼峰化
  String.prototype.camelize = function () {
    return this.valueOf().replace(/[-_\s]+(.)?/g, (match, c) =>
      c !== undefined ? c.toUpperCase() : ''
    );
  };
  console.log('-moz-transform'.camelize()); // "MozTransform"
}

{
  // 中划线化
  String.prototype.dasherSize = function () {
    return this.valueOf()
      .replace(/([A-Z])/g, '-$1')
      .replace(/[-_\s]+/g, '-')
      .toLowerCase();
  };
  console.log('MozTransform'.dasherSize() === '-moz-transform');
}

{
  // html转义和反转义

  // 将HTML特殊字符转换成等值的实体
  function escapeHTML(str) {
    const escapeChars = {
      '¢': 'cent',
      '£': 'pound',
      '¥': 'yen',
      '€': 'euro',
      '©': 'copy',
      '®': 'reg',
      '<': 'lt',
      '>': 'gt',
      '"': 'quot',
      '&': 'amp',
      "'": '#39'
    };
    const regex = new RegExp('[' + Object.keys(escapeChars).join('') + ']', 'g');
    return str.replace(regex, c => '&' + escapeChars[c] + ';');
  }
  console.log(escapeHTML('<div>Blah blah blah</div>'));
  // => "&lt;div&gt;Blah blah blah&lt;/div&gt";

  // 实体字符转换为等值的HTML。
  function unescapeHTML(str) {
    const htmlEntities = {
      nbsp: ' ',
      cent: '¢',
      pound: '£',
      yen: '¥',
      euro: '€',
      copy: '©',
      reg: '®',
      lt: '<',
      gt: '>',
      quot: '"',
      amp: '&',
      apos: "'"
    };
    return str.replace(/&([^;]+);/g, (match, key) => {
      if (key in htmlEntities) return htmlEntities[key];
      return match;
    });
  }
  console.log(unescapeHTML('&lt;div&gt;Blah blah blah&lt;/div&gt;'));
  // => "<div>Blah blah blah</div>"
}

{
  // 匹配成对标签
  /*
      要求匹配： 
        <title>regular expression</title>
        <p>bye bye</p>
        
      不匹配：
        <title>wrong!</p>
    */

  const regex = /<([^>]+)>[\d\D]*<\/\1>/;
  const string1 = '<title>regular expression</title>';
  const string2 = '<p>bye bye</p>';
  const string3 = '<title>wrong!</p>';
  console.log(regex.test(string1)); // true
  console.log(regex.test(string2)); // true
  console.log(regex.test(string3)); // false
}
```

## 正则表达式回溯法原理

```js
// .* 是非常影响效率的
// 为了减少一些不必要的回溯，可以把正则修改为 [^"]*
{
  console.log(/".*"/g.exec(`"acd"ef`)[0]);
  console.log(/"[^"]*"/g.exec(`"acd"ef`)[0]);
}

/* 
  正则表达式匹配字符串的这种方式，有个学名，叫回溯法。
    本质上就是深度优先搜索算法。其中退到之前的某一步这一过程，我们称为“回溯”。
    可以看出，路走不通时，就会发生“回溯”。即尝试匹配失败时，接下来的一步通常就是回溯。
*/

{
  // 贪婪量词
  const string = '12345';
  const regex = /(\d{1,3})(\d{1,3})/;
  console.log(string.match(regex));
  // ["12345", "123", "45", index: 0, input: "12345"]
  // 前面的 \d{1,3} 匹配的是"123"，后面的 \d{1,3} 匹配的是"45"
}

{
  // 惰性量词
  const string = '12345';
  const regex = /(\d{1,3}?)(\d{1,3})/;
  console.log(string.match(regex));
  // ["1234", "1", "234", index: 0, input: "12345"]

  const reg = /^(\d{1,3}?)(\d{1,3})$/;
  console.log(string.match(reg)); // 会出现回溯
  // [ '12345', '12', '345', index: 0, input: '12345']
}

{
  // 分支结构
  // 可能前面的子模式会形成了局部匹配，如果接下来表达式整体不匹配时，仍会继续尝试剩下的分支。这种尝试也可以看成一种回溯。
  const string = 'candy';
  const regex = /^(?:can|candy)$/;
  console.log(string.match(regex)); // 会出现回溯
  // [ 'candy', index: 0, input: 'candy']
}
```

## 正则表达式的拆分

```js
// 1. 结构和操作符

/* 
   JS正则表达式中，都有哪些结构:
     字符字面量、字符组、量词、锚字符、分组、选择分支、反向引用。
*/

{
  // 案例分析
  /ab?(c|de*)+|fg/;

  /* 
      1. 由于括号的存在，所以(c|de*)是一个整体结构
      2. 在(c|de*)中，注意其中的量词*，因此e*是一个整体结构。
      3. 又因为分支结构 | 优先级最低，因此c是一个整体、而de*是另一个整体。
      4. 同理，整个正则分成了 a、b?、(...)+、f、g
      5. 而由于分支的原因，又可以分成 ab?(c|de*)+ 和 fg 这两部分。
    */
}

// 2.注意要点

{
  /* 
      匹配字符串整体问题
      因为是要匹配整个字符串，我们经常会在正则前后中加上锚字符 ^ 和 $
      但是位置字符和字符序列优先级要比竖杠高
    */
  /^abc|bcd$/; // 错误写法 -> ^abc 或 bcd$

  /^(abc|bcd)$/; // 正确写法 -> ^abc$ 或 ^bcd$
}

{
  /* 
      量词连缀问题
        假设，要匹配这样的字符串：
        1. 每个字符为a、b、c任选其一
        2. 字符串的长度是3的倍数

    此时正则不能想当然地写成/^[abc]{3}+$/，这样会报错，说+前面没什么可重复的
    */
  /([abc]{3})+/; // 正确写法
}

{
  /* 
      元字符转义问题
        所谓元字符，就是正则中有特殊含义的字符
        所有结构里，用到的元字符总结如下：
        ^ $ . * + ? | \ / ( ) [ ] { } = ! : - ,
        当匹配上面的字符本身时，可以一律转义：
    */

  const string = '^$.*+?|\\/[]{}=!:-,';
  const regex = /\^\$\.\*\+\?\|\\\/\[\]\{\}\=\!\:\-\,/;
  console.log(regex.test(string)); // true
  // 现在的问题是，是不是每个字符都需要转义呢？否，看情况。

  {
    // 跟字符组相关的元字符有[]、^、-。因此在会引起歧义的地方进行转义。例如开头的^必须转义，不然会把整个字符组，看成反义字符组。

    const string = '^$.*+?|\\/[]{}=!:-,';
    const regex = /[\^$.*+?|\\/\[\]{}=!:\-,]/g;
    console.log(string.match(regex));
    // ["^", "$", ".", "*", "+", "?", "|", "\", "/", "[", "]", "{", "}", "=", "!", ":", "-", ","]
  }

  {
    // 我们知道[abc]，是个字符组。如果要匹配字符串"[abc]"时，可以写成 /\[abc\] /，也可以写成 /\[abc] /

    const string = '[abc]';
    const regex = /\[abc]/g;
    console.log(string.match(regex)[0]); // "[abc]"
  }

  {
    // 我们知道量词有简写形式{m,}，却没有{,n}的情况。虽然后者不构成量词的形式，但此时并不会报错。当然，匹配的字符串也是"{,n}"

    const string = '{,3}';
    const regex = /{,3}/g;
    console.log(string.match(regex)[0]); // "{,3}"
  }

  /* 
      其余情况
        比如= ! : - ,等符号，只要不在特殊结构中，也不需要转义。
        但是，括号需要前后都转义的，如/\(123\)/。
        至于剩下的^ $ . * + ? | \ /等字符，只要不在字符组内，都需要转义的
    */
}

// 案例分析

{
  // 身份证
  /^(\d{15}|\d{17}[\dxX])$/;

  /* 
      因为竖杠 | 的优先级最低，所以正则分成了两部分 \d{15} 和 \d{17}[\dxX]
      \d{15}表示15位连续数字
      \d{17}[\dxX]表示17位连续数字，最后一位可以是数字可以大小写字母"x"
    */
}

{
  // IPV4地址
  /^((0{0,2}\d|0?\d{2}|1\d{2}|2[0-4]\d|25[0-5])\.){3}(0{0,2}\d|0?\d{2}|1\d{2}|2[0-4]\d|25[0-5])$/;

  /* 
      1. ((...)\.){3}(...)
      2. 上面的两个(...)是一样的结构。表示匹配的是3位数字。因此整个结构是
        3位数.3位数.3位数.3位数
      3. 然后再来分析(...)
        它是一个多选结构，分成5个部分：
        0{0,2}\d，匹配一位数，包括0补齐的。比如，9、09、009
        0?\d{2}，匹配两位数，包括0补齐的，也包括一位数
        1\d{2}，匹配100到199
        2[0-4]\d，匹配200-249
        25[0-5]，匹配250-255。
    */
}

/* 
  掌握正则表达式中的优先级后，再看任何正则应该都有信心分析下去了
  竖杠的优先级最低，即最后运算
  另外关于元字符转义问题，当自己不确定与否时，尽管去转义，总之是不会错的。
*/
```

## 正则表达式的构建

```js
/* 
  1. 平衡法则

    构建正则有一点非常重要，需要做到下面几点的平衡：
      1. 匹配预期的字符串
      2. 不匹配非预期的字符串
      3. 可读性和可维护性
      4. 效率
*/

/* 
  2. 构建正则前提
    1. 是否能使用正则
      正则太强大了，以至于我们随便遇到一个操作字符串问题时，都会下意识地去想，用正则该怎么做。但我们始终要提醒自己，正则虽然强大，但不是万能的，很多看似很简单的事情，还是做不到的。
      
      比如匹配这样的字符串：1010010001....虽然很有规律，但是只靠正则就是无能为力。

    2. 是否有必要使用正则
      要认识到正则的局限，不要去研究根本无法完成的任务。同时，也不能走入另一个极端：无所不用正则。能用字符串API解决的简单问题，就不该正则出马。


    3. 是否有必要构建一个复杂的正则
*/

{
  // 从日期中提取出年月日
  const string = '2017-07-01';
  const regex = /^(\d{4})-(\d{2})-(\d{2})/;
  console.log(string.match(regex));
  // => ["2017-07-01", "2017", "07", "01", index: 0, input: "2017-07-01"]

  const result = string.split('-');
  console.log(result);
}

{
  // 判断是否有问号
  const string = '?id=xx&act=search';
  console.log(string.search(/\?/)); // 0

  console.log(string.includes('?'));
}

{
  // 获取子串
  const string = 'JavaScript';
  console.log(string.match(/.{4}(.+)/)[1]); // Script

  console.log(string.substring(4));
}

{
  // 密码匹配问题，要求密码长度6-12位，由数字、小写字符和大写字母组成，但必须至少包括2种字符

  /(?!^[0-9]{6,12}$)(?!^[a-z]{6,12}$)(?!^[A-Z]{6,12}$)^[0-9A-Za-z]{6,12}$/;

  // 使用多个小正则:
  const regex1 = /^[0-9A-Za-z]{6,12}$/;
  const regex2 = /^[0-9]{6,12}$/;
  const regex3 = /^[A-Z]{6,12}$/;
  const regex4 = /^[a-z]{6,12}$/;
  function checkPassword(string) {
    if (!regex1.test(string)) return false;
    if (regex2.test(string)) return false;
    if (regex3.test(string)) return false;
    if (regex4.test(string)) return false;
    return true;
  }
}

/* 
  3.准确性

    所谓准确性，就是能匹配预期的目标，并且不匹配非预期的目标。
    这里提到了“预期”二字，那么我们就需要知道目标的组成规则。
    不然没法界定什么样的目标字符串是符合预期的，什么样的又不是符合预期的
*/

{
  /* 
      匹配固定电话：
        055188888888  0551-88888888  (0551)88888888
    */

  // 字符是否出现的情形
  /^\(?0\d{2,3}\)?-?[1-9]\d{6,7}$/g;
  // 虽然也能匹配上述目标字符串，但也会匹配(0551-88888888这样的字符串

  // 了解各部分的模式规则  构建分支  提取公共部分
  /^(0\d{2,3}-?|\(0\d{2,3}\))[1-9]\d{6,7}$/;
}

{
  /* 
      匹配浮点数
        1.23、+1.23、-1.23
        10、+10、-10
        .2、+.2、-.2
    */

  /*
      可以看出正则分为三部分。
      符号部分：[+-]
      整数部分：\d+
      小数部分：\.\d+
      上述三个部分，并不是全部都出现。如果此时很容易写出如下的正则：
    */
  /^[+-]?(\d+)?(\.\d+)?$/; // 此正则看似没问题，但这个正则也会匹配空字符""。

  /*
      要匹配1.23、+1.23、-1.23，可以用/^[+-]?\d+\.\d+$/
      要匹配10、+10、-10，可以用/^[+-]?\d+$/
      要匹配.2、+.2、-.2，可以用/^[+-]?\.\d+$/
      因此整个正则是这三者的或的关系，提取公众部分后
    */
  /^[+-]?(\d+\.\d+|\d+|\.\d+)$/g;
}

/* 
  4. 效率

    保证了准确性后，才需要是否要考虑要优化。大多数情形是不需要优化的，除非运行的非常慢。什么情形正则表达式运行才慢呢？我们需要考察正则表达式的运行过程（原理）。
    正则表达式的运行分为如下的阶段：
      1. 编译
      2. 设定起始位置
      3. 尝试匹配
      4. 匹配失败的话，从下一位开始继续第3步
      5. 最终结果：匹配成功或失败
*/

{
  const regex = /\d+/g;
  console.log(regex.lastIndex, regex.exec('123abc34def'));
  console.log(regex.lastIndex, regex.exec('123abc34def'));
  console.log(regex.lastIndex, regex.exec('123abc34def'));
  console.log(regex.lastIndex, regex.exec('123abc34def'));
  console.log('123abc34def'.match(regex));
  // => 0 ["123", index: 0, input: "123abc34def"]
  // => 3 ["34", index: 6, input: "123abc34def"]
  // => 8 null
  // => 0 ["123", index: 0, input: "123abc34def"]
}

{
  // 使用具体型字符组来代替通配符，来消除回溯
  /".*?"/;
  /"[^"]*"/; // 优化

  // 使用非捕获型分组
  /^[+-]?(\d+\.\d+|\d+|\.\d+)$/;
  /^[+-]?(?:\d+\.\d+|\d+|\.\d+)$/; //优化

  // 独立出确定字符
  /a+/;
  /aa*/; // 优化

  // 提取分支公共部分
  /this|that/;
  /th(?:is|at)/; //优化

  // 减少分支的数量，缩小它们的范围
  /red|read/;
  /rea?d/;
  // 此时分支和量词产生的回溯的成本是不一样的。但这样优化后，可读性会降低的。
}
```

## 正则表达式编程

```js
// 1. 正则表达式的四种操作

{
  // 验证
  const regex = /\d/;
  const string = 'abc123';

  // search
  console.log(string.search(regex) !== -1); // true

  // test  ---常用
  console.log(regex.test(string)); // true

  // match
  console.log(string.match(regex) !== null); // true

  // exec
  console.log(regex.exec(string) !== null); // true
}

{
  // 切分  split
  {
    const regex = /,/;
    const string = 'html,css,javascript';
    console.log(string.split(regex)); // ["html", "css", "javascript"]
  }

  {
    const regex = /\D/;
    console.log('2017/06/26'.split(regex)); // ["2017", "06", "26"]
    console.log('2017.06.26'.split(regex)); // ["2017", "06", "26"]
    console.log('2017-06-26'.split(regex)); // ["2017", "06", "26"]
  }
}

{
  // 提取
  const regex = /^(\d{4})\D(\d{2})\D(\d{2})$/;
  const string = '2017-06-26';

  // match --- 常用
  console.log(string.match(regex));
  // ["2017-06-26", "2017", "06", "26", index: 0, input: "2017-06-26"]

  // test
  regex.test(string);
  console.log(RegExp.$1, RegExp.$2, RegExp.$3); // "2017" "06" "26"

  // search
  string.search(regex);
  console.log(RegExp.$1, RegExp.$2, RegExp.$3); // "2017" "06" "26"

  // replace
  const date = [];
  string.replace(regex, (match, year, month, day) => {
    date.push(year, month, day);
  });
  console.log(date); // [ '2017', '06', '26' ]
}

{
  // 替换

  const string = '2017-06-26';
  const today = new Date(string.replace(/-/g, '/'));
  console.log(today); // 2017-06-25T16:00:00.000Z
}

/* 
   2. 相关API注意要点
     从上面可以看出用于正则操作的方法，共有6个，字符串实例4个，正则实例2个：
     String#search
     String#split
     String#match
     String#replace
     RegExp#test
     RegExp#exec
*/

{
  console.log(1 + '-------------------------');
  // 1. search和match的参数问题
  // 字符串实例的那4个方法参数都支持正则和字符串。但search和match，会把字符串转换为正则。

  const string = '2017.06.27';

  console.log(string.search('.')); // 0
  //需要修改成下列形式之一
  console.log(string.search('\\.')); // 4
  console.log(string.search(/\./)); // 4

  console.log(string.match('.')); // ["2", index: 0, input: "2017.06.27"]
  //需要修改成下列形式之一
  console.log(string.match('\\.')); // [".", index: 4, input: "2017.06.27"]
  console.log(string.match(/\./)); // [".", index: 4, input: "2017.06.27"]

  console.log(string.split('.')); // ["2017", "06", "27"]

  console.log(string.replace('.', '/')); // "2017/06.27"
}

{
  console.log(2 + '-------------------------');
  // 2. match返回结果的格式问题  与正则对象是否有修饰符g有关

  const string = '2017.06.27';
  const regex1 = /\b(\d+)\b/;
  const regex2 = /\b(\d+)\b/g;
  console.log(string.match(regex1));
  // ["2017", "2017", index: 0, input: "2017.06.27"]
  console.log(string.match(regex2)); // ["2017", "06", "27"]
}

{
  console.log(3 + '-------------------------');
  // 3 exec比match更强大
  // 当正则没有g时，使用match返回的信息比较多。但是有g后，就没有关键的信息index了。
  // 而exec方法就能解决这个问题，它能接着上一次匹配后继续匹配：

  const string = '2017.06.27';
  const regex = /\b(\d+)\b/g;
  let result;
  while ((result = regex.exec(string))) {
    console.log(result, regex.lastIndex);
  }
  // ["2017", "2017", index: 0, input: "2017.06.27"] 4
  // ["06", "06", index: 5, input: "2017.06.27"] 7
  // ["27", "27", index: 8, input: "2017.06.27"] 10
}

{
  console.log(4 + '-------------------------');
  // 4 修饰符g，对exec和test的影响

  // 正则实例的两个方法exec、test，当正则是全局匹配时，每一次匹配完成后，都会修改lastIndex

  let regex = /a/g;

  console.log(regex.test('a'), regex.lastIndex); // true 1
  console.log(regex.test('aba'), regex.lastIndex); // true 3
  console.log(regex.test('abab'), regex.lastIndex); // false 0

  // 如果没有g，自然都是从字符串第0个字符处开始尝试匹配
  regex = /a/;
  console.log(regex.test('a'), regex.lastIndex); // true 0
  console.log(regex.test('aba'), regex.lastIndex); // true 0
  console.log(regex.test('abab'), regex.lastIndex); // true 0
}

{
  console.log(5 + '-------------------------');
  // 5 test整体匹配时需要使用^和$
  console.log(/123/.test('a123b')); // true
  console.log(/^123$/.test('a123b')); // false
  console.log(/^123$/.test('123')); // true
}

{
  console.log(6 + '-------------------------');
  // 6 split相关注意事项
  // 第一，它可以有第二个参数，表示结果数组的最大长度
  const string = 'html,css,javascript';
  console.log(string.split(/,/, 2)); // ["html", "css"]

  // 第二，正则使用分组时，结果数组中是包含分隔符的
  console.log(string.split(/(,)/)); // ["html", ",", "css", ",", "javascript"]
}

{
  console.log(7 + '-------------------------');
  // 7 replace是很强大的
  /*
      当第二个参数是字符串时，如下的字符有特殊的含义：
        $1,$2,...,$99 匹配第1~99个分组里捕获的文本
        $& 匹配到的子串文本
        $` 匹配到的子串的左边文本
        $' 匹配到的子串的右边文本
        ? 美元符号
    */
  const result = '2+3=5'.replace(/=/, "$&$`$&$'$&");
  console.log(result); // "2+3=2+3=5=5"

  // 当第二个参数是函数时，我们需要注意该回调函数的参数具体是什么
  '1234 2345 3456'.replace(/(\d)\d{2}(\d)/g, (match, $1, $2, index, input) => {
    console.log([match, $1, $2, index, input]);
  });
  // ["1234", "1", "4", 0, "1234 2345 3456"]
  // ["2345", "2", "5", 5, "1234 2345 3456"]
  // ["3456", "3", "6", 10, "1234 2345 3456"]
}

{
  console.log(8 + '-------------------------');
  // 8 使用构造函数需要注意的问题
  // 一般不推荐使用构造函数生成正则，而应该优先使用字面量。因为用构造函数会多写很多\

  const string = '2017-06-27 2017.06.27 2017/06/27';
  let regex = /\d{4}(-|\.|\/)\d{2}\1\d{2}/g;
  console.log(string.match(regex));
  // ["2017-06-27", "2017.06.27", "2017/06/27"]

  regex = new RegExp('\\d{4}(-|\\.|\\/)\\d{2}\\1\\d{2}', 'g');
  console.log(string.match(regex));
  // ["2017-06-27", "2017.06.27", "2017/06/27"]
}

{
  console.log(9 + '-------------------------');
  // 9 修饰符
  /*
      g 全局匹配，即找到所有匹配的，单词是global
      i 忽略字母大小写，单词ignoreCase
      m 多行匹配，只影响^和$，二者变成行的概念，即行开头和行结尾。单词是multiline
    */

  // 字面量正则对象相应属性只读
  const regex = /\w/gim;
  regex.ignoreCase = regex.multiline = regex.global = false;
  console.log(regex.global); // true
  console.log(regex.ignoreCase); // true
  console.log(regex.multiline); // true
}

{
  console.log(10 + '-------------------------');
  // 10 source属性
  /*
      正则实例对象属性，除了global、ignoreCase、multiline、lastIndex属性之外
      还有一个source属性。
      在构建动态的正则表达式时，可以通过查看该属性，来确认构建出的正则到底是什么
    */

  const className = 'high';
  const regex = new RegExp('(^|\\s)' + className + '(\\s|$)');
  console.log(regex.source); // "(^|\\s)high(\\s|$)"
  console.log(regex.toString()); // "/(^|\\s)high(\\s|$)/"
  console.log(regex.valueOf()); // (^|\\s)high(\\s|$)
}

{
  console.log(11 + '-------------------------');
  // 11 构造函数属性
  /*
      构造函数的静态属性基于所执行的最近一次正则操作而变化。
      除了是$1,...,$9之外，还有几个不太常用的属性（有兼容性问题）：
      RegExp.input 最近一次目标字符串，简写成RegExp["$_"]
      RegExp.lastMatch 最近一次匹配的文本，简写成RegExp["$&"]
      RegExp.lastParen 最近一次捕获的文本，简写成RegExp["$+"]
      RegExp.leftContext 目标字符串中lastMatch之前的文本，简写成RegExp["$`"]
      RegExp.rightContext 目标字符串中lastMatch之后的文本，简写成RegExp["$'"]
    */

  const regex = /([abc])(\d)/g;
  const string = 'a1b2c3d4e5';
  string.match(regex);

  console.log(RegExp.input); // "a1b2c3d4e5"
  console.log(RegExp['$_']); // "a1b2c3d4e5"

  console.log(RegExp.lastMatch); // "c3"
  console.log(RegExp['$&']); // "c3"

  console.log(RegExp.lastParen); // "3"
  console.log(RegExp['$+']); // "3"

  console.log(RegExp.leftContext); // "a1b2"
  console.log(RegExp['$`']); // "a1b2"

  console.log(RegExp.rightContext); // "d4e5"
  console.log(RegExp["$'"]); // "d4e5"
}
```

## 正则表达式编程案例

```js
// 1 使用构造函数生成正则表达式

/* 
  我们知道要优先使用字面量来创建正则，但有时正则表达式的主体是不确定的，此时可以使用构造函数来创建。
  模拟getElementsByClassName方法，就是很能说明该问题的一个例子。
  这里getElementsByClassName函数的实现思路是：
    比如要获取className为"high"的dom元素
    首先生成一个正则：/(^|\s)high(\s|$)/
    然后再用其逐一验证页面上的所有dom元素的类名，拿到满足匹配的元素即可。
*/

{
  const getElementsByClassName = className => {
    const elements = document.getElementsByTagName('*');
    const regex = new RegExp('(^|\\s)' + className + '(\\s|$)');
    const result = [];
    for (const element of elements)
      if (regex.test(element.className)) result.push(element);
    return result;
  };
}

// 2 使用字符串保存数据
{
  const utils = {};
  'Boolean|Number|String|Function|Array|Date|RegExp|Object|Error'
    .split('|')
    .forEach(item => {
      utils['is' + item] = obj =>
        Object.prototype.toString.call(obj) === '[object ' + item + ']';
    });
  console.log(utils);
  console.log(utils.isArray([1, 2, 3])); // true
}

// 3 if语句中使用正则替代&&
{
  // 比如，模拟ready函数，即加载完毕后再执行回调（不兼容ie的）
  const readyRE = /complete|loaded|interactive/;
  const ready = callback => {
    if (readyRE.test(document.readyState) && document.body) callback();
    else
      document.addEventListener(
        'DOMContentLoaded',
        () => {
          callback();
        },
        false
      );
  };
}

// 4 使用强大的replace
/* 
  因为replace方法比较强大，有时用它根本不是为了替换，只是拿其匹配到的信息来做文章。
  这里以查询字符串（querystring）压缩技术为例
  注意下面replace方法中，回调函数根本没有返回任何东西。
*/
{
  const compress = source => {
    const keys = new Map();
    source.replace(/([^=&]+)=([^&]*)/g, (_, key, value) => {
      keys.set(key, (keys.has(key) ? keys.get(key) + ',' : '') + value);
    });
    const result = [];
    for (const [key, value] of keys) result.push(`${key}=${value}`);

    return result.join('&');
  };
  console.log(compress('a=1&b=2&a=3&b=4')); // "a=1,3&b=2,4"
}
```

## 正则表达式

```js
{
  // 创建

  // 1.构造函数创建  new RegExp('正则表达式','修饰符')
  const regex = new RegExp('hello', 'igm');

  // 2.直接直面量创建  /正则表达式/修饰符
  const reg = /hello/gim;
}

{
  // 字符分类
  // 1.普通字符 字母、数字、下划线、汉字、没有特殊含义的符号（, ; !@等）
  // 实际上不是特殊字符的字符都是普通字符
  // 2.特殊字符
  // \：将特殊字符转义成普通字符
  // 3.模式修饰符
  // i：ignoreCase，匹配时忽视大小写
  // m：multiline，多行匹配
  // g：global，全局匹配
  // 字面量创建正则时，模式修饰符写在一对反斜线后
}

{
  // 实例方法
  {
    /*
         1.exec()
           用来匹配字符串中符合正则表达式的字符串
           如果匹配到，返回值是一个result数组:
           [匹配的内容，index: 在str中匹配的起始位置，input: 参数字符串，groups: undefined]
           否则返回null
       */

    const str = 'Hello world javascript hello';
    const reg = new RegExp('hello', 'igm');
    const res = reg.exec(str);
    console.log(res);
    /* 
          [
            'Hello',
            index: 0,
            input: 'Hello world javascript hello',
            groups: undefined
          ]
        */
  }

  {
    /*
          2.test()
            用来测试待检测的字符串中是否有可以匹配到正则表达式的字符串
            如果有返回true，否则返回false
        */
    const reg = /hello/;
    const str = 'hello world';
    console.log(reg.test(str)); //true
  }

  {
    /* 
          3.toSting() toLocaleString()
            把正则表达式的内容转化成字面量形式字符串/有本地特色的字符串
        */

    const reg = /hello/;
    console.log(reg.toString()); // /hello/
    console.log(reg.toLocaleString()); // /hello/
  }

  {
    // 4.valueOf()  返回正则表达式本身
    const reg = /hello/;
    const regex = new RegExp('HELLO');
    console.log(reg, regex); // /hello/ /HELLO/
    console.log(reg.valueOf(), regex.valueOf()); // /hello/ /HELLO/
  }
}

{
  console.log('1.lastIndex....................');
  // 正则表达式实例属性
  {
    /* 
          1.lastIndex
            当没设置全局匹配时，该属性值始终为0
            设置了全局匹配时，每执行一次exec/test来匹配
            lastIndex就会移向匹配到的字符串的下一个位置
            当指向的位置后没有可以再次匹配的字符串时
            下一次执行exec返回null test执行返回false
            然后lastIndex归零，从字符串的开头重新匹配一轮
            可以理解成，每次正则查找的起点就是lastIndex 
        */

    const str = 'hello hello hello';
    const reg1 = /hello/; // 没设置全局匹配
    const reg2 = /hello/g; // 设置了全局匹配
    console.log(reg1.lastIndex); // 0
    console.log(reg1.exec(str)); // 返回第一个hello
    console.log(reg1.lastIndex); // 0

    console.log(reg2.lastIndex); // 0
    console.log(reg2.exec(str)); // 返回第一个hello

    console.log(reg2.lastIndex); // 5
    console.log(reg2.exec(str)); // 返回第二个hello

    console.log(reg2.lastIndex); // 11
    console.log(reg2.exec(str)); // 返回第三个hello

    console.log(reg2.lastIndex); // 17
    console.log(reg2.exec(str)); //返回 null

    console.log(reg2.lastIndex); // 0
    console.log(reg2.exec(str)); // 返回第一个hello
  }

  {
    console.log('2.ignoreCase、global、multiline........');
    /* 
          2.ignoreCase、global、multiline
            判断正则表达式中是否有忽略大小写、全局匹配、多行匹配三个模式修饰符
        */
    const pattern = /hello/gim;
    console.log(pattern.ignoreCase); //true
    console.log(pattern.global); //true
    console.log(pattern.multiline); //true
  }

  {
    // 3.source  返回字面量形式的正则表达式（类似于toString）
    const pattern = /hello/gim;
    console.log(pattern.source); // hello
  }
}

{
  // 正则表达式语法
  {
    /* 
          1.直接量字符 
            正则表达式中的所有字母和数字都是按照字面含义进行匹配的
            Javascript正则表达式语法也支持非字母的字符匹配
            这些字符需要通过反斜线\作为前缀进行转义。

             字符	           匹配
             字母和数字字符	   自身
             \o	               Null字符
             \t	               制表符
             \n	               换行符
             \v	               垂直制表符
             \f	               换页符
             \r	               回车符
        */

    const reg = /\n/;
    console.log(reg.test('hello \n world')); //true
  }

  {
    console.log('2.字符集合..........................');
    /* 
          2.字符集合
            字符集合，也叫字符组。匹配集合中的任意一个字符
            可以使用连字符‘-’指定一个范围。
            
            [^xyz] 反义或补充字符集，也叫反义字符组
            匹配任意不在括号内的字符。也可以通过使用连字符 '-' 指定一个范围内的字符。
            
            注意：^写在[]里面是反义字符组
        */

    const reg1 = /[abc]/; //匹配括号中任意一个字母
    console.log(reg1.test('aaa hello world1')); //true

    const reg2 = /[0-9]/; //匹配任意一个数字
    console.log(reg2.test('aaa hello world1')); //true

    const reg3 = /[^xyz]/; //包含xyz返回false 匹配除xyz之外的任何字符
    console.log(reg3.test('xyz')); //false
  }

  {
    console.log('3.边界符...........................');
    /* 
          3.边界符
            ^ 匹配输入开始。表示匹配行首的文本（以谁开始)。如果多行（multiline）标志被设为 true，该字符也会匹配一个断行（line break）符后的开始处。
            
            $ 匹配输入结尾。表示匹配行尾的文本（以谁结束）。如果多行（multiline）标志被设为 true，该字符也会匹配一个断行（line break）符的前的结尾处。
            
            如果 ^和 $ 在一起，表示必须是精确匹配。
        */

    const rg = /abc/; // 只要包含有abc这个字符串返回的都满足
    console.log(rg.test('abcd')); //true

    const reg1 = /^bc/; // 必须是以bc开头的字符串才会满足
    console.log(reg1.test('abcd')); // false

    const reg2 = /ab$/; // 必须是以ab结尾的字符串才会满足
    console.log(reg2.test('abc')); // false

    const reg3 = /^abc$/; // 精确匹配 要求必须是 abc字符串才满足
    console.log(reg3.test('abc')); // true
  }

  {
    console.log('4.字符集与边界符一起使用.............');
    // 4.字符集与边界符一起使用

    const reg1 = /^[ab]$/; // 只有是a 或 b 才满足
    console.log(reg1.test('a')); //true
    console.log(reg1.test('b')); //true
    console.log(reg1.test('ab'), '-------------'); // false

    const reg2 = /^[0-9A-Za-z]$/; // 匹配任意一个字母或数字
    console.log(reg2.test('a')); //true
    console.log(reg2.test('A')); //true
    console.log(reg2.test('2')); //true
    console.log(reg2.test('ab'), '-------------'); //false

    const reg3 = /^[^0-9A-Za-z]$/; // ^反义字符 只要包含方括号内的字符，都返回 false
    console.log(reg3.test('a')); //false
    console.log(reg3.test('A')); //false
    console.log(reg3.test('2')); //false
    console.log(reg3.test('!')); //true
  }

  {
    console.log('5.零宽单词和非零宽单词的边界--------');
    /* 
          5.零宽单词和非零宽单词的边界
            \b 零宽单词边界 单词和空格之间位置 （取一个完整单词）
            \B单词边界和单词边界中间的位置 不匹配单词边界 （取某个单词中间部分）
        */

    const str = 'hello world javascript';

    const reg1 = /\bld\b/;
    console.log(reg1.exec(str)); //null

    const reg2 = /\bhello\b/;
    console.log(reg2.exec(str)); // 数组

    const reg3 = /\Bld\B/;
    console.log(reg3.exec(str)); //null

    const reg4 = /\Brl\B/;
    console.log(reg4.exec(str)); // 数组
  }

  {
    console.log(' 6.字符类-----------------------');
    /* 
          6.字符类
            将直接量字符单独放进方括号内就组成了字符类
            一个字符类可以匹配它所包含的任意字符。

        字符类          含义
        .     匹配除换行符\n和回车符之外的任何单个字符，等效于 [^\n\r]
        \d    匹配一个数字字符，等效于[0-9]
        \D    [^0-9]
        \w    匹配包括下划线的任何单个字符，[a-zA-Z0-9_]
        \W    [^a-zA-Z0-9_]
        \s    匹配任何Unicode空白字符,等效于[\f\t\n\r]
        \S    [^\f\t\n\r]

        * 记忆： d ==> digit（数字） s ==> space（空白） w ==> word（单词）
        */
    const reg = /./; // 匹配除\n\r 之外的任意字符
    console.log(reg.test('\nhello\r world js')); // true
    console.log(reg.test('\n\r ')); // true
    console.log(reg.test('\n\r'), '------------------'); // false

    const reg1 = /\d/; // \d 等同于[0-9] 匹配任意数字
    console.log(reg1.test('12'));
    console.log(reg1.test('0'));
    console.log(reg1.test('1a'));
    console.log(reg1.test('a'), '------------------'); //false

    const reg2 = /\D/; // \D等同于[^0-9] 不匹配数字
    console.log(reg2.test('1')); //false
    console.log(reg2.test('a'));
    console.log(reg2.test('!'));
    console.log(reg2.test(' '), '------------------');

    const reg3 = /\w/; // \w 匹配[0-9A-Za-z_]
    console.log(reg3.test('a'));
    console.log(reg3.test('A'));
    console.log(reg3.test('_'));
    console.log(reg3.test('1'));
    console.log(reg3.test(' '), '------------------'); //false

    const reg4 = /\W/; // \W 匹配[^0-9A-Za-z_]
    console.log(reg4.test('0'));
    console.log(reg4.test('a'));
    console.log(reg4.test('_'));
    console.log(reg4.test(' '), '------------------'); //true

    const reg5 = /\s/; // \s 匹配任何unicode空白符 空格 制表符 换行符 [\f\n\t\r]
    console.log(reg5.test(' '));
    console.log(reg5.test('\n'));
    console.log(reg5.test('\r'));
    console.log(reg5.test('a'), '------------------'); //false

    const reg6 = /\S/; // \S 等效于 [^\f\t\n\r]
    console.log(reg6.test('1'));
    console.log(reg6.test('a'));
    console.log(reg6.test('!'));
    console.log(reg6.test('\n')); //false
  }
}

{
  console.log('数量词...............');
  // 数量词

  /*
      字符	   含义
      *	       >=0次
      +	       ≥1 次
      ?	       0或1次
      {n}	   n 次
      {n,}	   ≥n 次
      {n,m}	   n到m 次
    */

  const reg1 = /^a*$/; // * 允许出现0次或多次
  console.log(reg1.test('')); // true
  console.log(reg1.test('a')); // true
  console.log(reg1.test('aa'), '------------------'); // true

  const reg2 = /^a+$/; // + 允许出现1次或多次
  console.log(reg2.test('')); //false
  console.log(reg2.test('a')); //true
  console.log(reg2.test('aa'), '------------------'); //true

  const reg3 = /^a?$/; // ? 只允许a出现1次或0次
  console.log(reg3.test('')); //true
  console.log(reg3.test('a')); //true
  console.log(reg3.test('aa')); //false
  console.log(reg3.test('aaa'), '------------------'); //false

  const reg4 = /^a{3}$/; // {3} 允许重复3次
  console.log(reg4.test('aaa')); //true
  console.log(reg4.test('aaaa')); //false
  console.log(reg4.test('a'), '------------------'); //false

  const reg5 = /^a{3,5}$/; // {3,5} 允许重复出现3次-5次之间，也就是>=3且<=5
  console.log(reg5.test('aa')); //false
  console.log(reg5.test('aaa'));
  console.log(reg5.test('aaaa'));
  console.log(reg5.test('aaaaa'));
  console.log(reg5.test('aaaaaa'), '------------------'); //false

  const reg6 = /^a{3,}$/; // {3,} 允许重复出现3次或3次以上多次
  console.log(reg6.test('aa')); //false
  console.log(reg6.test('aaa'));
  console.log(reg6.test('aaaaaa'), '------------------');
}

{
  console.log('贪婪模式和非贪婪模式------------------');
  /* 
      贪婪模式和非贪婪模式
        贪婪模式：尽可能多的匹配（首先取最多可匹配的数量为一组进行匹配）
        当匹配剩余的字符串，还会继续尝试新的匹配，直到匹配不到为止，为默认模式。
        
        非贪婪模式：尽可能少的匹配（每次取最少匹配的数量为一组进行匹配）
        直到匹配不到为止 (使用方法：在量词后加上?)
    */

  //贪婪模式
  const reg = /\d{3,6}/g;
  console.log(reg.exec('12345678')); // 数组 '123456'
  console.log(reg.exec('12345678')); // null

  //非贪婪模式
  const regex = /\d{3,6}?/g;
  console.log(regex.exec('123456789')); // '123',
  console.log(regex.exec('123456789')); // '456'
  console.log(regex.exec('123456789')); // '789'
  console.log(regex.exec('123456789')); // null
  console.log(regex.exec('123456789')); // '123'
}

{
  // 选择，分组，候选
  {
    console.log('选择-------------------------');
    /*
          选择
            字符"|"用于分隔供选择的字符
            选择项的尝试匹配次序是从左到右，直到发现了匹配项
            如果左边的选择项匹配，就忽略右边的匹配项，即使它可以产生更好的匹配。
        */
    const reg = /html|css|js/g;
    console.log(reg.exec('hello world css html')); // 'css'
    console.log(reg.exec('hello world css html')); // 'html'
  }

  {
    console.log('分组--------------------------');
    // 分组  有圆括号包裹的一个小整体成为分组
    const reg = /BruitBruitBruit/;
    console.log(reg.test('Bruit')); //false
    console.log(reg.test('BruitBruit')); //false
    console.log(reg.test('BruitBruitBruit'));
    console.log(reg.test('BruitBruitBruitBruit'), '-------------------');

    const regex = /^(Bruit){3}$/;
    console.log(regex.test('Bruit')); //false
    console.log(regex.test('BruitBruit')); //false
    console.log(regex.test('BruitBruitBruit')); //true
    console.log(regex.test('BruitBruitBruitBruit')); //false
  }

  // 候选  选择分组综合
  {
    console.log('候选-----------------');
    const reg = /I like (html|css|js)/;
    console.log(reg.test('I like html'));
    console.log(reg.test('I like css'));
    console.log(reg.test('I like js'));
    console.log(reg.test('I like table')); //false
  }
}

{
  console.log('捕获和引用--------------------------');
  // 捕获和引用
  {
    // 被正则表达式匹配（捕获）到的字符串会被暂存起来。其中，由分组捕获的串会从1开始编号，于是我们可以引用这些串

    const reg = /(\d{4})-(\d{2})-(\d{2})/;
    const result = reg.exec('2023-06-28');
    if (result !== null) {
      const [, year, month, day] = result; // 解构赋值获取捕获组的值
      console.log(year, month, day);
    }
    // 废弃....
    console.log(RegExp.$1); // 2023
    console.log(RegExp.$2); // 06
    console.log(RegExp.$3, '-----------------------'); // 28
  }

  {
    // 嵌套分组的捕获 : 规则是以左括号出现的顺序进行捕获
    const reg = /((apple) is (a (fruit)))/;
    reg.exec('apple is a fruit');
    console.log(RegExp.$1); //apple is a fruit
    console.log(RegExp.$2); //apple
    console.log(RegExp.$3); //a fruit
    console.log(RegExp.$4, '--------------------'); //fruit
  }

  {
    // 引用： 正则表达式里也能进行引用，这称为反向引用
    const reg = /(\w{3}) is \1/;
    console.log(reg.test('kid is kid')); // true
    console.log(reg.test('dik is dik')); // true
    console.log(reg.test('kid is dik')); // false
    console.log(reg.test('dik is kid'), '---------------------'); // false
    // \1引用了第一个被分组所捕获的串，换言之，表达式是动态决定的。

    // 注意，如果编号越界了，则会被当成普通的表达式：
    const regex = /(\w{3}) is \6/;
    console.log(regex.test('kid is kid')); // false
    console.log(regex.test('kid is \6')); // true
  }
}

{
  // String对正则表达式的支持
  {
    console.log('search---------------');
    /* 
          search
            查找字符串中是否有匹配正则的字符串
            有则返回字符串第一次出现时的位置，无则返回null
            正则中无论是否有全局匹配都不会影响返回结果
        */
    const reg1 = /hello/;
    const reg2 = /hello/g;
    console.log('hello world hello'.search(reg1)); // 0
    console.log('hello world hello'.search(reg2)); // 0
  }

  {
    console.log('match-------------------');
    /* 
          match
            字符串匹配符合正则表达式字符串 匹配到返回数组
            并返回该字符串的一个数组，其中包括字符串内容、位置
            
            如果正则设置全局匹配，则一次性返回所有符合正则表达式的字符串数组
            如果其中添加了分组，返回符合要求的字符串以及分组的一个数组
            但如果同时开启全局匹配则不会在数组中添加分组内容
        */
    const str = 'hello world hello';
    const reg1 = /hello/;
    const reg2 = /hello/g;
    const reg3 = /(?:he)l(lo)/;
    const reg4 = /(he)llo/g;

    console.log(str.match(reg1)); // => [hello]
    console.log(str.match(reg2)); // => [hello, hello]
    console.log(str.match(reg3)); // => [hello, lo]
    console.log(str.match(reg4)); // => [hello, hello]
  }

  {
    console.log('split-------------------');
    // split  以某种形式分割字符串 将其转换为数组
    const str = 'terry123larry456tony';
    const reg = /\d{3}/;
    console.log(str.split(reg)); //[ 'terry', 'larry', 'tony' ]
  }

  {
    console.log('replace----------------------');
    // replace  满足正则表达式的内容会被替换
    const str = 'javascript';
    const reg = /javascript/;
    const res = str.replace(reg, 'java');
    console.log(res, str, reg); //java javascript /javascript/
  }
}

{
  /* 
      前瞻表达式
    
      表达式	 名称	        描述
      (?=exp)	正向前瞻	匹配后面满足表达式exp的位置
      (?!exp)	负向前瞻	匹配后面不满足表达式exp的位置
    */
  const str = 'He, Hi, I am Hi.';
  // 一定要匹配什么
  const reg1 = /H(?=i)/g;
  console.log(str.replace(reg1, 'T')); //He, Ti, I am Ti.

  // 一定不要匹配什么
  const reg2 = /H(?!i)/g;
  console.log(str.replace(reg2, 'T')); //Te, Hi, I am Hi.
}

{
  // 例如：
  // 匹配密码，必须包含大写，小写和数字, 和特殊字符(!, @,#,%,&), 且大于6位
  /(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#%&])^[A-Za-z\d!@#%&]{6,}$/g;

  // 以1为开头 第二位为3，4，5，7，8中的任意一位 最后以0 - 9的9个整数结尾
  /^1[34578]\d{9}$/g;
}
```
