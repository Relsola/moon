<template>
	<div class="vp-raw">
		<div>
			示例：<br />
			输入
			<el-text class="cursor-pointer" type="primary" @click="copyExample">
				(add 2 (subtract 4 2))
				<el-icon><DocumentCopy /> </el-icon>
			</el-text>
			<el-button type="primary" link @click="copyExample"> </el-button>

			<br />
			经过编译器输出 => <el-text type="primary">add(2, subtract(4, 2));</el-text>
		</div>

		<div class="flex my5">
			<el-input v-model="input" clearable placeholder="输入" show-word-limit maxlength="80" />

			<el-button type="primary" class="ml4" @click="create">编译</el-button>
		</div>

		<el-input v-model="output" type="textarea" autosize placeholder="输出" readonly />
	</div>
</template>

<script setup lang="ts">
import { copyToClipboard } from '@/utils';
import compiler from './the-super-tiny-compiler';

const example = '(add 2 (subtract 4 2))';

const input = ref<string>('');
const output = ref<string>('');

async function copyExample() {
	const res = await copyToClipboard(example);
	ElMessage({ type: res ? 'success' : 'error', message: res ? '复制成功' : '复制失败' });
}

const create = () => {
	try {
		const result = compiler(input.value);
		output.value = result;
	} catch (error: any) {
		console.log('error', error);
		output.value = error;
	}
};

watch(input, () => output.value && (output.value = ''));
</script>
