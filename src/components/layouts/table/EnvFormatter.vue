<script setup lang="ts">import type { ITag } from '@/interfaces/workshop';

const props = defineProps<{
  row: any,
  prop: string | number
}>()


</script>

<template>
  <div class="d-inline-flex" v-for="(tag) in row[prop]">
    <el-tag  class="mb-1 me-1" >{{ tag.name }}</el-tag>
  </div>

</template>


<style scoped>

</style>
