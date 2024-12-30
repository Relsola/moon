<script lang="ts" setup>
import { ref } from 'vue';
import type { TabsPaneContext } from 'element-plus';

const activeName = ref('web');

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event);
};
</script>

<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="Web" name="web">Web</el-tab-pane>
    <el-tab-pane label="GitHub" name="github">GitHub</el-tab-pane>
    <el-tab-pane label="Book" name="book">Book</el-tab-pane>
    <el-tab-pane label="Other" name="other">Other</el-tab-pane>
  </el-tabs>

  <el-backtop :right="100" :bottom="100" />
</template>
