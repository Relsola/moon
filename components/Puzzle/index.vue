<script setup lang="ts">
import { ref, onMounted } from 'vue';

const rows = ref<number[][]>([]);
const emptyCell = ref({ row: 0, cell: 0 });

const shuffle = () => {
  const numbers = Array.from({ length: 15 }, (_, i) => i + 1);
  numbers.push(0);

  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }

  rows.value = Array.from({ length: 4 }, (_, i) => numbers.slice(i * 4, i * 4 + 4));
  emptyCell.value = { row: 3, cell: 3 };
};
</script>

<template>
  <div class="puzzle">
    <div class="puzzle__container">
      <div class="puzzle__row" v-for="(row, rowIndex) in rows" :key="rowIndex">
        <div class="puzzle__cell" v-for="(cell, cellIndex) in row" :key="cellIndex">
          <div
            class="puzzle__cell-inner"
            :class="{ 'puzzle__cell-inner--empty': cell === 0 }"
            @click="moveCell(rowIndex, cellIndex)"
          >
            {{ cell }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
