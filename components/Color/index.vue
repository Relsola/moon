<!-- 拾色器/取色器 -->

<script setup lang="ts">
import { ref } from 'vue';

const color = ref('#ff0000');

const changeColor = (color: string) => {
  console.log(color);
};

const readImage = (file: File) => {
  const reader = new FileReader();
  reader.onload = e => {
    const img = new Image();
    img.src = e.target.result as string;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0, img.width, img.height);
      const data = ctx?.getImageData(0, 0, img.width, img.height).data;
      const color = `rgb(${data![0]}, ${data![1]}, ${data![2]})`;
      console.log(color);
    };
  };
  reader.readAsDataURL(file);
};
</script>

<template>
  <div class="color">
    <input type="color" v-model="color" @change="changeColor(color)" />
  </div>

  <!-- 图片取色 -->
  <input type="file" @change="readImage($event.target.files![0])" />
</template>
