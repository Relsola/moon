<template>
	<p>示例：(add 2 (subtract 4 2)) => add(2, subtract(4, 2));</p>

	<el-input v-model="input" placeholder="输入" />

	<el-button @click="tk">编译</el-button>

	<el-input v-model="output" placeholder="输出" disabled />
</template>

<script setup lang="ts">
import { tokenizer, parser, transformer, codeGenerator, compiler } from './the-super-tiny-compiler';

const input = ref<string>('');
const output = ref<string>('');

const tk = () => {
	try {
		const result = compiler(input.value);
		output.value = result;
	} catch (error) {
		console.log('error', error);
		output.value = error;
	}
};
</script>
