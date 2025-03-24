# 项目配置

## tsconfig.json 配置解释

```json
/* 
  tsconfig.json 是 TypeScript 项目的配置文件
  如果一个目录下存在一个 tsconfig.json 文件
  那么往往意味着这个目录就是 TypeScript 项目的根目录。

  tsconfig.json 包含 TypeScript 编译的相关配置
  通过更改编译配置项，我们可以让 TypeScript 编译出 ES6、ES5、node 的代码。
  
  tsconfig.json 重要字段
    files - 设置要编译的文件的名称；
    include - 设置需要进行编译的文件，支持路径模式匹配；
    exclude - 设置无需进行编译的文件，支持路径模式匹配；
    compilerOptions - 设置与编译流程相关的选项。
*/
// compilerOptions 选项
{
	/* 根选项 */
	"include": ["./src/**/*"], // 指定被编译文件所在的目录
	"exclude": [], // 指定不需要被编译的目录
	//使用小技巧：在填写路径时 ** 表示任意目录， * 表示任意文件。

	/* 项目选项 */
	"compilerOptions": {
		/* 基本选项 */
		"target": "es5", // 指定 ECMAScript 目标版本: 'ES3' (default), 'ES5', 'ES6'/'ES2015', 'ES2016', 'ES2017', or 'ESNEXT'
		"module": "commonjs", // 指定使用模块: 'commonjs', 'amd', 'system', 'umd' or 'es2015'
		"lib": [], // 指定要包含在编译中的库文件
		"allowJs": true, // 允许编译 javascript 文件
		"checkJs": true, // 报告 javascript 文件中的错误
		"jsx": "preserve", // 指定 jsx 代码的生成: 'preserve', 'react-native', or 'react'
		"declaration": true, // 生成相应的 '.d.ts' 文件
		"sourceMap": true, // 生成相应的 '.map' 文件
		"outFile": "./", // 将输出文件合并为一个文件
		"outDir": "./", // 指定输出目录
		"rootDir": "./", // 用来控制输出目录结构 --outDir.
		"removeComments": true, // 删除编译后的所有的注释
		"noEmit": true, // 不生成输出文件
		"importHelpers": true, // 从 tslib 导入辅助工具函数
		"isolatedModules": true, // 将每个文件做为单独的模块 （与 'ts.transpileModule' 类似）.

		/* 严格检查选项 */
		"strict": true, // 开启所有严格的类型检查
		"alwaysStrict": true, // 在代码中注入'use strict'
		"noImplicitAny": true, // 不允许隐式的any类型
		"noImplicitThis": true, // 不允许this有隐式的any类型
		"strictNullChecks": true, // 不允许把null、undefined赋值给其他类型的变量
		"strictBindCallApply": true, // 严格的bind/call/apply检查
		"strictFunctionTypes": true, // 不允许函数参数双向协变
		"strictPropertyInitialization": true, // 类的实例属性必须初始化

		/* 额外的检查 */
		"noUnusedLocals": true, // 是否检查未使用的局部变量
		"noUnusedParameters": true, // 是否检查未使用的参数
		"noImplicitReturns": true, // 检查函数是否不含有隐式返回值
		"noImplicitOverride": true, // 是否检查子类继承自基类时，其重载的函数命名与基类的函数不同步问题
		"noFallthroughCasesInSwitch": true, // 检查switch中是否含有case没有使用break跳出
		"noUncheckedIndexedAccess": true, // 是否通过索引签名来描述对象上有未知键但已知值的对象
		"noPropertyAccessFromIndexSignature": true, // 是否通过" . “(obj.key) 语法访问字段和"索引”( obj[“key”])， 以及在类型中声明属性的方式之间的一致性

		/* 模块解析选项 */
		"moduleResolution": "Node", // 选择模块解析策略： 'node' (Node.js) or 'classic' (TypeScript pre-1.6)
		"baseUrl": "./", // 用于解析非相对模块名称的基目录
		"paths": {}, // 模块名到基于 baseUrl 的路径映射的列表
		"rootDirs": [], // 根文件夹列表，其组合内容表示项目运行时的结构内容
		"typeRoots": [], // 包含类型声明的文件列表
		"types": [], // 需要包含的类型声明文件名列表
		"allowSyntheticDefaultImports": true, // 允许从没有设置默认导出的模块中默认导入。

		/* Source Map Options */
		"sourceRoot": "./", // 指定调试器应该找到 TypeScript 文件而不是源文件的位置
		"mapRoot": "./", // 指定调试器应该找到映射文件而不是生成文件的位置
		"inlineSourceMap": true, // 生成单个 sourcemaps 文件，而不是将 sourcemaps 生成不同的文件
		"inlineSources": true, // 将代码与 sourcemaps 生成到一个文件中，要求同时设置了 --inlineSourceMap 或 --sourceMap 属性

		/* 其他选项 */
		"experimentalDecorators": true, // 启用装饰器
		"emitDecoratorMetadata": true, // 为装饰器提供元数据的支持
		"resolveJsonModule": true, //是否解析 JSON 模块
		"esModuleInterop": true // 允许 export 导出 由import from 导入
	}
}
```
