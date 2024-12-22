<script setup lang="ts">
import { ref } from 'vue';

const msg = ref('Hello World!');
</script>

<template>
  <h1>{{ msg }}</h1>
  <el-input
    v-model="msg"
    style="width: 240px"
    class="min-h-5"
    placeholder="Please input"
  />
</template>
