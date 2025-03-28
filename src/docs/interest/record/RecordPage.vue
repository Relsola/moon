<template>
	<el-table class="vp-raw" :data="tableData" size="small" border>
		<el-table-column
			v-for="col in tableColumn"
			:key="col.prop"
			v-bind="col"
			header-align="center"
			align="center"
		>
			<template #default="{ row }">
				<template v-if="col.prop === 'name' && row.link">
					<el-link type="primary" style="font-size: 12px" :href="row.link" target="_blank">
						{{ row.name }}
					</el-link>
				</template>
				<template v-else>{{ row[col.prop] }}</template>
			</template>
		</el-table-column>
	</el-table>

	<el-pagination
		class="mt2"
		background
		layout="prev, pager, next, jumper, ->, total"
		v-model:current-page="page"
		:total="total"
	/>
</template>

<script setup lang="ts">
import data from './data.json';

const tableColumn = [
	{ prop: 'name', label: '游戏名', minWidth: 200 },
	{ prop: 'endTime', label: '最后游玩日期', width: 120 },
	{ prop: 'platform', label: '游玩平台', width: 80 },
	{ prop: 'score', label: '分（100）', width: 100 },
	{ prop: 'time', label: '游玩时间', width: 80 }
];

const title = ref<'game' | 'anime'>('game');

const page = ref<number>(1);
const size = 10;

const total = computed(() => data[title.value].length);
const tableData = computed(() =>
	data[title.value].slice((page.value - 1) * size, page.value * size)
);
</script>
