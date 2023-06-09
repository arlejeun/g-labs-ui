<script setup lang="ts">
import type { PropType } from 'vue'
import type { IWorkshop } from '@/interfaces/workshop'
import router from '@/router';
import { computed } from '@vue/reactivity';
import type { ITag } from '@/interfaces/workshop';
import { useWorkshopStore } from '@/stores/workshop';
import { useUserStore } from '@/stores/user';

const wStore = useWorkshopStore()
const { workshopsCriteria } = storeToRefs(wStore)

const store = useUserStore()

const props = defineProps({
  workshop: {
    type: Object as PropType<IWorkshop>,
    required: true
  }
})

const applyTagFilter = (tag: ITag) => {
  const tagFilter = []
  tagFilter[0] = tag.id
  //loadWorkshops(query)
  if (tag.category == 'Business') {
    workshopsCriteria.value.categories = [...tagFilter]
  } else {
    workshopsCriteria.value.tags = [...tagFilter]
  }
  
}

const catTags = computed(() => {
  return props.workshop?.settings?.tags?.filter(x => x.category == 'Business')
})

const techTags = computed(() => {
  return props.workshop?.settings?.tags?.filter(x => x.category == 'Technical')
})

const WORKSHOPS_BASE = import.meta.env.VITE_GLABS_GCP_CONTENT

// function workshopDefaultName(workshop: IWorkshop) {

//   if (workshop.name && workshop.name.length > 0) {
//     return workshop.name;
//   } else {
//     const idname = workshop.title.replace(/\s/g, '-')
//     return idname;
//   }
// }


function goToWorkshop(workshop: IWorkshop) {
  if (workshop?.settings?.name && workshop?.isPublished) {
    router.push({name: 'workshops-all', params: {all: workshop.settings.name}});
  }
}

const workshopLocalizedTitle = computed(() => props.workshop.title)
const workshopLocalizedDesc = computed(() => props.workshop.description)
const workshopLevel = computed(() => props.workshop?.settings?.level)
const workshopDuration = computed(() => props.workshop?.settings?.duration)


const workThumbnail = computed(() => `${WORKSHOPS_BASE}resources/images/${props.workshop?.settings?.image_filename}`)

</script>

<template>

  <!-- Card item START -->
  <div class="col-md-4 col-xl-4">
    <div class="card shadow p-2 pb-0 h-100">
      <!-- Image -->
      <!--<img :src="`https://gdemo.demo.genesys.com/api/gdemo-assets/${workshop.image}`" class="rounded-2" alt="Card image">-->
      <img :src="workThumbnail" class="rounded-2" alt="Card image">
      <!--<img :src="imageOptions.src" class="w-[300px] h-[200px]">-->
      <!-- Card body START -->
      <div class="card-body px-3 pb-0">
        <!-- Rating and cart -->
        <!-- <div class="d-flex flex-row mb-3">
          <a v-for="category in workshop.categories" :key="category.name" class="badge bg-primary text-white me-1">
            <p class="mb-0"><small>{{ category }}</small></p>
          </a>
        </div> -->

        <!-- Title -->
        <h5 class="card-title text-primary"><a href="">{{ workshopLocalizedTitle }}</a></h5>
        <p class="mb-1"><small>{{ workshopLocalizedDesc }}</small></p>

        <!-- List -->
        <ul class="nav nav-divider mt-2 mb-2 mb-sm-3">
          <li class="text-primary me-1" v-for="(tag) in catTags" :key="tag.id">
            <!-- <el-tag class="me-2">{{ tag.name }}</el-tag> -->
            <el-button @click="applyTagFilter(tag)"
                type="primary"
                size="small"
                >{{ tag.name }}</el-button
              >
          </li>
          <li class="text-primary me-1" v-for="(tag) in techTags" :key="tag.id">
            <!-- <el-tag class="me-2">{{ tag.name }}</el-tag> -->
            <el-button @click="applyTagFilter(tag)"
                type="info"
                size="small"   
                plain             
                >{{ tag.name }}</el-button
              >
          </li>
        </ul>

 

        <ul class="nav nav-divider mb-2 mb-sm-3">
          <li class="me-2"><i class="me-1 bi bi-stopwatch"></i>
            <small>{{ workshopDuration }}</small>
          </li>
          <li class="ms-2"> <i class="me-1 bi bi-speedometer2"></i>
            <small>Level: {{ workshopLevel }}</small>

          </li>
        </ul>


      </div>
      <!-- Card body END -->

      <!-- Card footer START-->
      <div class="card-footer pt-0">
        <!-- Price and Button -->
        <div class="d-sm-flex justify-content-sm-between align-items-center">
          <!-- Price -->
          <div class="d-flex align-items-center">

          </div>
          <!-- Button -->
          <div class="mt-2 mt-sm-0">
            <a @click="goToWorkshop(workshop)" class="btn btn-sm btn-primary-soft mb-0 w-100">View Detail<i
                class="bi bi-arrow-right ms-2"></i></a>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Card item END -->

</template>

<style>

</style>
