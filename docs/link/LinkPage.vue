<template>
	<el-tabs v-model="activeName">
		<el-tab-pane v-for="{ label, data } in data" :label="label" :name="label">
			<template #label>
				{{ label }}
			</template>
			<a v-for="{ name, href } in data" :href="href" target="_blank">
				<el-card class="inline-block m2 w80" shadow="hover">
					{{ name }}
				</el-card>
			</a>
		</el-tab-pane>
	</el-tabs>

	<el-backtop :right="100" :bottom="100" />
</template>

<script setup lang="ts">
import data from './data.json';

const activeName = ref('JavaScript');
</script>
