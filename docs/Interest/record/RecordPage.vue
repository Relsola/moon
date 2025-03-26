<template>
	<el-table :data="tableData" border>
		<el-table-column v-for="col in tableColumn" :key="col.prop" v-bind="col" header-align="center">
			<template #default="{ row }">
				<template v-if="col.prop === 'name' && row.link">
					<el-link type="primary" :href="row.link" target="_blank">{{ row.name }}</el-link>
				</template>
				<template v-else>{{ row[col.prop] }}</template>
			</template>
		</el-table-column>
	</el-table>

	<el-pagination
		class="mt5"
		background
		layout="prev, pager, next, jumper, ->, total"
		v-model:page-size="size"
		v-model:current-page="page"
		:total="total"
	/>
</template>

<script setup lang="ts">
import data from './data.json';

const tableColumn = [
	{ prop: 'name', label: '游戏名', minWidth: 200, align: 'center' },
	{ prop: 'date', label: '日期', width: 120, align: 'center' },
	{ prop: 'platform', label: '平台', width: 80, align: 'center' },
	{ prop: 'score', label: '分（100）', width: 100, align: 'center' },
	{ prop: 'thought', label: '想法', width: 80, align: 'center' }
];

const title = ref<'game' | 'anime'>('game');

const page = ref<number>(1);
const size = ref<number>(30);

const total = computed(() => data[title.value].length);
const tableData = computed(() => {
	return data[title.value].slice((page.value - 1) * size.value, page.value * size.value);
});

onMounted(() => {
	const div = document.getElementsByClassName('vp-doc _moon_interest_record_');
	div[0] && div[0].classList.remove('vp-doc');
});
</script>
