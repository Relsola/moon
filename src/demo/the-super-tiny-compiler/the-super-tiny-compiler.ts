interface Token {
	type: string;
	value: string;
}

/** 匹配空白符 */
const WHITESPACE = /\s/;
/** 匹配数值 */
const NUMBERS = /[0-9]/;
/** 匹配字母 */
const LETTERS = /[a-z]/i;

export function tokenizer(input: string): Token[] {
	/** 当前指针 */
	let current: number = 0;

	const tokens: Token[] = [];

	while (current < input.length) {
		let char: string = input[current];

		/**
		 * 一个表达式的开始
		 * (add 2 (subtract 4 2))
		 * ^      ^
		 */
		if (char === '(') {
			tokens.push({ type: 'paren', value: '(' });
			current++;
			continue;
		}

		/**
		 * 一个表达式的结束
		 * (add 2 (subtract 4 2))
		 *                     ^^
		 */
		if (char === ')') {
			tokens.push({ type: 'paren', value: ')' });
			current++;
			continue;
		}

		/**
		 * 跳过空格分隔符
		 * (add 2 (subtract 4 2))
		 *     ^ ^         ^ ^
		 */
		if (WHITESPACE.test(char)) {
			current++;
			continue;
		}

		/**
		 * (add 2 (subtract 4 2))
		 *      ^           ^ ^
		 */
		if (NUMBERS.test(char)) {
			let value = '';
			while (NUMBERS.test(char)) {
				value += char;
				char = input[++current];
			}
			tokens.push({ type: 'number', value });
			continue;
		}

		/**
		 * 可以是一个字符串
		 * "2"
		 * ^ ^
		 */
		if (char === '"') {
			let value = '';
			// 跳过开头的引号
			char = input[++current];
			// 循环直到遇到结束的引号且避免死循环
			while (char !== '"' && current < input.length - 1) {
				value += char;
				char = input[++current];
			}

			char = input[++current];
			tokens.push({ type: 'string', value });
			continue;
		}

		/**
		 * (add 2 (subtract 4 2))
		 *  ^^^    ^^^^^^^^
		 */
		if (LETTERS.test(char)) {
			let value = '';
			while (LETTERS.test(char)) {
				value += char;
				char = input[++current];
			}
			tokens.push({ type: 'name', value });
			continue;
		}

		throw new TypeError('unknown what this character is: ' + char);
	}

	return tokens;
}

export function parser(tokens: Token[]): any {
	let current: number = 0;

	function walk(): any {
		let token = tokens[current];

		if (token.type === 'number') {
			current++;

			return { type: 'NumberLiteral', value: token.value };
		}

		if (token.type === 'string') {
			current++;

			return { type: 'StringLiteral', value: token.value };
		}

		if (token.type === 'paren' && token.value === '(') {
			token = tokens[++current];

			const node: any = { type: 'CallExpression', name: token.value, params: [] };
			token = tokens[++current];

			while (token.type !== 'paren' || (token.type === 'paren' && token.value !== ')')) {
				node.params.push(walk());
				token = tokens[current];
			}

			current++;

			return node;
		}

		throw new TypeError(token.type);
	}

	const ast: any = {
		type: 'Program',
		body: []
	};

	while (current < tokens.length) {
		ast.body.push(walk());
	}

	return ast;
}

export function traverser(ast: any, visitor: any) {
	function traverseArray(array: any, parent: any) {
		array.forEach((child: any) => traverseNode(child, parent));
	}

	function traverseNode(node: any, parent: any) {
		let methods = visitor[node.type];

		if (methods && methods.enter) {
			methods.enter(node, parent);
		}

		switch (node.type) {
			case 'Program':
				traverseArray(node.body, node);
				break;

			case 'CallExpression':
				traverseArray(node.params, node);
				break;

			case 'NumberLiteral':
			case 'StringLiteral':
				break;

			default:
				throw new TypeError(node.type);
		}

		if (methods && methods.exit) {
			methods.exit(node, parent);
		}
	}

	traverseNode(ast, null);
}

export function transformer(ast: any): any {
	let newAst = {
		type: 'Program',
		body: []
	};

	ast._context = newAst.body;

	traverser(ast, {
		NumberLiteral: {
			enter(node: any, parent: any) {
				parent._context.push({
					type: 'NumberLiteral',
					value: node.value
				});
			}
		},

		StringLiteral: {
			enter(node: any, parent: any) {
				parent._context.push({
					type: 'StringLiteral',
					value: node.value
				});
			}
		},

		CallExpression: {
			enter(node: any, parent: any) {
				let expression: any = {
					type: 'CallExpression',
					callee: {
						type: 'Identifier',
						name: node.name
					},
					arguments: []
				};

				node._context = expression.arguments;

				if (parent.type !== 'CallExpression') {
					expression = {
						type: 'ExpressionStatement',
						expression: expression
					};
				}

				parent._context.push(expression);
			}
		}
	});

	return newAst;
}

export function codeGenerator(node: any): any {
	switch (node.type) {
		case 'Program':
			return node.body.map(codeGenerator).join('\n');

		case 'ExpressionStatement':
			return (
				codeGenerator(node.expression) + ';' // << (...because we like to code the *correct* way)
			);

		case 'CallExpression':
			return codeGenerator(node.callee) + '(' + node.arguments.map(codeGenerator).join(', ') + ')';

		case 'Identifier':
			return node.name;

		case 'NumberLiteral':
			return node.value;

		case 'StringLiteral':
			return '"' + node.value + '"';

		default:
			throw new TypeError(node.type);
	}
}

export function compiler(input: any): string {
	let tokens = tokenizer(input);
	let ast = parser(tokens);
	let newAst = transformer(ast);
	let output = codeGenerator(newAst);

	return output;
}
