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
    <el-tab-pane label="Web 前端" name="web">
      Web
      <!-- >
      [JS正则表达式完整教程](https://juejin.cn/post/6844903487155732494?searchId=202412221741358057531E480441E6BB82)
      >
      [正则表达式字符详解](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Regular_expressions) -->
    </el-tab-pane>
    <el-tab-pane label="Java 后端" name="java">Java</el-tab-pane>
    <el-tab-pane label="GitHub" name="github">GitHub</el-tab-pane>
    <el-tab-pane label="Other" name="other">Other</el-tab-pane>
  </el-tabs>

  <el-backtop :right="100" :bottom="100" />
</template>
