<template>
	<div class="mb5 vp-raw">
		<el-select
			v-model="value"
			clearable
			filterable
			placeholder="常用的正则表达式"
			@change="() => (regexText = value)"
			style="width: 80%; margin-right: 8px"
		>
			<el-option v-for="{ label, value, example } in data" :label="label" :value="value">
				<span class="float-left">{{ label }}</span>
				<span style="float: right; color: var(--el-text-color-secondary); font-size: 13px">
					{{ example }}
				</span>
			</el-option>
		</el-select>
		<el-button type="primary">生成代码</el-button>
	</div>

	<el-input v-model="regexText" style="width: 80%" placeholder="请输入正则表达式">
		<template #prepend> / </template>
		<template #append> /{{ modifier.join('') }} </template>
	</el-input>

	<el-popover placement="bottom" :width="200" trigger="click">
		<el-checkbox-group v-model="modifier">
			<el-checkbox
				v-for="{ label, value } in modifierList"
				:label="label"
				:value="value"
				:key="label"
			/>
		</el-checkbox-group>

		<template #reference>
			<el-button class="ml2">修饰符</el-button>
		</template>
	</el-popover>

	<el-input v-model="text" class="mt5" type="textarea" placeholder="在此输入待匹配文本" />

	<div
		v-html="matchText"
		class="my5 w100% border-solid border border-slate-300 rounded p2 text-xs min-h-12"
	></div>

	<el-input v-model="replaceText" style="width: 60%" placeholder="在此输入替换文本">
		<template #prepend> 替换文本 </template>
	</el-input>

	<el-button type="primary" class="ml2" @click="replace">替换</el-button>

	<div
		v-html="replaceResult"
		class="my5 w100% border-solid border border-slate-300 rounded p2 text-xs min-h-12"
	></div>

	<el-backtop :right="100" :bottom="100" />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import data from './data.json';

/** 常用的正则表达式 */
const value = ref('');
/** 正则表达式文本 */
const regexText = ref('');
/** 修饰符 */
const modifier = ref(['g']);
/** 进行匹配的文本 */
const text = ref('');
/** 替换文本 */
const replaceText = ref('');
/** 替换结果 */
const replaceResult = ref('<span class="text-slate-400">替换结果...</span>');
/** 修饰符列表 */
const modifierList = [
	{ value: 'g', label: '全局匹配 -g' },
	{ value: 'i', label: '忽略大小写 -i' },
	{ value: 'm', label: '多行模式 -m' },
	{ value: 's', label: '匹配换行符 -s' },
	{ value: 'u', label: 'unicode -u' },
	{ value: 'y', label: '粘连匹配 -y' }
];

/** 正则表达式 */
const reg = computed(() => {
	try {
		return new RegExp(regexText.value, modifier.value.join(''));
	} catch (e) {
		return null;
	}
});

/** 匹配结果 */
const matchText = computed(() => {
	// 待匹配文本为空
	if (!text.value) return '<span class="text-slate-400">匹配结果...</span>';
	// 正则表达式为空
	if (!reg.value) return '<span class="text-red-500">无效的正则表达式</span>';

	return text.value.replace(reg.value, match => `<span class="bg-blue">${match}</span>`);
});

/** 替换 */
function replace() {
	if (!text.value || !reg.value) {
		replaceResult.value = '<span class="text-slate-400">替换结果...</span>';
		return;
	}
	replaceResult.value = text.value.replace(reg.value, replaceText.value);
}
</script>
