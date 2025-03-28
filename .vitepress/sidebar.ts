export default {
	'/archives/2025': [
		{
			text: '2025',
			items: [{ text: '编程与人生', link: '/archives/2025/programming-and-life' }]
		}
	],

	'frontend/general': [
		{
			text: '最佳实践',
			collapsed: false,
			items: [{ text: '最佳实践', link: '/frontend/general/best-practices' }]
		},
		{
			text: '用户体验优化',
			collapsed: false,
			items: []
		},
		{
			text: '前端性能优化',
			collapsed: false,
			items: []
		},
		{
			text: 'DEMO',
			collapsed: false,
			items: [
				{ text: '微型编译器', link: '/frontend/general/tiny-compiler' },
				{ text: '正则测试器', link: '/frontend/general/regex-tester' },
				{ text: '拼图游戏', link: '/frontend/general/puzzle-game' }
			]
		}
	],

	'frontend/es6': [
		{
			text: 'ES6+',
			items: [
				{ text: '块级作用域', link: '/frontend/es6/block-scope' },
				{ text: '字符串的扩展', link: '/frontend/es6/string' },
				{ text: '数值的扩展', link: '/frontend/es6/number' },
				{ text: '函数的扩展', link: '/frontend/es6/function' },
				{ text: '数组的扩展', link: '/frontend/es6/array' },
				{ text: '对象的扩展', link: '/frontend/es6/object' },
				{ text: '解构赋值', link: '/frontend/es6/destructuring' },
				{ text: '迭代器和生成器', link: '/frontend/es6/iterator-generator' },
				{ text: '模块化', link: '/frontend/es6/module' },
				{ text: '参考资料', link: '/frontend/es6/references' }
			]
		}
	],

	'frontend/typescript': [
		{
			text: 'TypeScript',
			items: [
				{ text: '数据类型', link: '/frontend/typescript/data-types' },
				{ text: '类型推断', link: '/frontend/typescript/type-inference' },
				{ text: 'TS 类型', link: '/frontend/typescript/ts-type' },
				{ text: '接口', link: '/frontend/typescript/interface' },
				{ text: '泛型', link: '/frontend/typescript/generics' },
				{ text: '关键字', link: '/frontend/typescript/ts-keywords' },
				{ text: '泛型工具', link: '/frontend/typescript/generics-utility' },
				{ text: '项目配置', link: '/frontend/typescript/handbook' }
			]
		}
	],

	'backend/java': [
		{
			text: 'Java 基础',
			collapsed: false,
			items: [
				{ text: '基础知识', link: '/backend/java/java-basic-knowledge' },
				{ text: '泛型', link: '/backend/java/' },
				{ text: '注解', link: '/backend/java/' },
				{ text: '异常', link: '/backend/java/' },
				{ text: '反射', link: '/backend/java/' }
			]
		},
		{
			text: 'Java 进阶',
			collapsed: false,
			items: [
				{ text: '并发', link: '/backend/java/' },
				{ text: 'IO/NIO', link: '/backend/java/' }
			]
		},
		{
			text: 'JVM',
			collapsed: false,
			items: []
		},
		{
			text: '新版本特性',
			collapsed: false,
			items: []
		}
	],

	'backend/db': [
		{
			text: '数据库',
			items: [
				{ text: 'SQL 语法基础', link: '/backend/db/sql' },
				{ text: 'SQL 语句优化', link: '/backend/db/sql-optimization' },
				{ text: 'MySql', link: '/backend/db/mysql' },
				{ text: 'Redis', link: '/backend/db/redis' }
			]
		}
	]
};
