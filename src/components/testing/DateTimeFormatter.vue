<script setup lang="ts">

import type { ITag } from '@/interfaces/workshop';

const props = defineProps<{
  row: any,
  column: any
}>()

</script>

<template>
  <span>
    <i class="icon-date"></i> {{ props.row[props.column] }}
  </span>
  </template>


<style scoped>

</style>
