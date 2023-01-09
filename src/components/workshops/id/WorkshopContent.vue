<script setup lang="ts">
import { useWorkshopStore } from '@/stores/workshop';
import VueMarkdown from "vue-markdown-render";

const wStore = useWorkshopStore()
const { getWorkshopPage } = storeToRefs(wStore)

const mdProps = { html: true };

</script>

<template>

      <vue-markdown :options="mdProps" :source="getWorkshopPage" />

</template>

<style>

</style>
