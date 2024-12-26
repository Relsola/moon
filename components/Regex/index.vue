<script setup lang="ts">
import { ref } from 'vue';

const regex = ref('');
const modifier = ref(['g']);

const modifierList = [
  { value: 'g', label: '全局匹配 -g' },
  { value: 'i', label: '忽略大小写 -i' },
  { value: 'm', label: '多行模式 -m' },
  { value: 's', label: '匹配换行符 -s' },
  { value: 'u', label: 'unicode -u' },
  { value: 'y', label: '粘连匹配 -y' }
];
</script>

<template>
  <el-input v-model="regex" style="width: 60%" placeholder="请输入正则表达式">
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

    <div class="my2" style="border-top: 1px solid var(--el-border-color)"></div>
    <el-link
      href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Regular_expressions#%E9%80%9A%E8%BF%87%E6%A0%87%E5%BF%97%E8%BF%9B%E8%A1%8C%E9%AB%98%E7%BA%A7%E6%90%9C%E7%B4%A2"
      target="_blank"
    >
      <el-icon><Position /></el-icon> &nbsp; 修饰符介绍
    </el-link>

    <template #reference>
      <el-button class="ml2">修饰符</el-button>
    </template>
  </el-popover>

  <el-popover placement="bottom" :width="200" trigger="click">
    <template #reference>
      <el-button class="ml2">语法参考</el-button>
    </template>
  </el-popover>
</template>
