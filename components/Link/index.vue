<script lang="ts" setup>
import { ref } from 'vue';
import data from './data.json';

const activeName = ref('web');
</script>

<template>
  <el-tabs v-model="activeName">
    <el-tab-pane v-for="{ label, name, data } in data" :label="label" :name="name">
      <a v-for="{ name, href } in data" :href="href" target="_blank">
        <el-card class="inline-block m2 w80" shadow="hover">
          {{ name }}
        </el-card>
      </a>
    </el-tab-pane>
  </el-tabs>

  <el-backtop :right="100" :bottom="100" />
</template>
