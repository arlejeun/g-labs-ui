<script setup lang="ts">
import type { PropType } from 'vue'
import type { IWorkshop } from '@/interfaces'
import router from '@/router';
import { computed } from '@vue/reactivity';

const props = defineProps({
  workshop: {
    type: Object as PropType<IWorkshop>,
    required: true
  }
})

function workshopDefaultName(workshop: IWorkshop) {

  if (workshop.name && workshop.name.length > 0) {
      return workshop.name;
  } else {
      const idname = workshop.title.replace(/\s/g, '-')
      return idname;
  }
}


function goToWorkshop(workshop: IWorkshop) { 
  if (workshop.id && workshop.manifest) {
    router.push(`/workshops/${workshopDefaultName(workshop)}`);
  }
}

const workThumbnail = computed(() => `https://gdemo.demo.genesys.com/api/gdemo-assets/${props.workshop.image_filename}`)
 

//const imageOptions = ref({ src: 'https://place.dog/300/200' })
//const imageOptions = ref({ src: `https://gdemo.demo.genesys.com/api/gdemo-assets/${props.workshop.image}` })
//const { isLoading, error } = useImage(imageOptions)
// const change = () => {
//   const time = new Date().getTime()
//   imageOptions.value.src = `https://place.dog/300/200?t=${time}`
// }

// const imageOptions = ref({scr: props.workshop.image})
// const { isLoading, error } = useImage(imageOptions) 
</script>

<template>

  <!-- Card item START -->
  <div class="col-md-6 col-xl-4">
    <div class="card shadow p-2 pb-0 h-100">
      <!-- Image -->
      <!--<img :src="`https://gdemo.demo.genesys.com/api/gdemo-assets/${workshop.image}`" class="rounded-2" alt="Card image">-->
      <img :src="workThumbnail" class="rounded-2" alt="Card image">
      <!--<img :src="imageOptions.src" class="w-[300px] h-[200px]">-->
      <!-- Card body START -->
      <div class="card-body px-3 pb-0">
        <!-- Rating and cart -->
        <div class="d-flex flex-row mb-3">
          <!-- <a class="badge bg-primary text-white"><i class="bi fa-fw bi-star-fill me-2 text-warning"></i>{{category}}</a> -->
          <a  v-for="category in workshop.categories"
              :key="category.name" class="badge bg-primary text-white me-1"><p class="mb-0"><small>{{category}}</small></p></a>
        </div>

        <!-- Title -->
        <h5 class="card-title text-primary"><a href="">{{workshop.title}}</a></h5>
        <p><small>{{workshop.description}}</small></p>

          <!-- List -->
          <ul class="nav nav-divider mb-2 mb-sm-3">
            <li class="text-primary me-1" v-for="tag in workshop.tags"
              :key="tag.id" ><small><u>{{tag}}</u></small>
            </li>
					</ul>

          <ul class="nav nav-divider mb-2 mb-sm-3">
            <li class="me-2"><i class="me-1 bi bi-stopwatch"></i>
          <small>{{ workshop.duration }}</small>
            </li>
            <li class="ms-2"> <i class="me-1 bi bi-speedometer2"></i>
          <small>Level: {{ workshop.level }}</small>
        
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
