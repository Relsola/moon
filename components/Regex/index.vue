<script setup lang="ts">
import { ref, computed } from 'vue';

/** 正则表达式文本 */
const regexText = ref('');
/** 修饰符 */
const modifier = ref(['g']);
/** 进行匹配的文本 */
const text = ref('');
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

  return text.value.replace(
    reg.value,
    match => `<span class="bg-blue">${match}</span>`
  );
});
</script>

<template>
  <el-input v-model="regexText" style="width: 60%" placeholder="请输入正则表达式">
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

    <el-divider style="margin: 5px 0" />
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

  <el-input
    v-model="text"
    class="mt5"
    type="textarea"
    placeholder="在此输入待匹配文本"
  />

  <div
    v-html="matchText"
    class="mt5 w100% border-solid border border-slate-300 rounded p2 text-xs min-h-12"
  ></div>
</template>
