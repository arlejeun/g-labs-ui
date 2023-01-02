<script setup lang="ts">import type { ITag } from '@/interfaces/workshop';



const props = defineProps<{
  row: any
}>()

// const tagName = computed(() => {return props.row.tags?.map((t: ITag) => t.category == 'Business' ? t.name : null)})
const categories = computed(() => {
    return props.row?.tags?.filter((t: ITag) => t.category == 'Business')
})
const technical = computed(() => {
    return props.row?.tags?.filter((t: ITag) => t.category == 'Technical')
})
</script>

<template>
  <div class="d-inline-flex" v-for="(tag) in categories">
    <el-tag class="mb-1 me-1" >{{ tag.name }}</el-tag>
  </div>
  <div class="d-inline-flex" v-for="(tag) in technical">
    <el-tag type="info" class="mb-1 me-1" >{{ tag.name }}</el-tag>
  </div>

</template>


<style scoped>

</style>
