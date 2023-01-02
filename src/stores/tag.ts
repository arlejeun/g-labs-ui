import type { Ref } from 'vue'
import { defineStore } from 'pinia'
import { useAxios } from '@vueuse/integrations/useAxios'
import { GLabsApiClient } from '@/apis/glabs'
import type { ICategoryTag, ITagsResponse, TagQueryDTO } from '@/interfaces/workshop'
import { notify } from '@kyvg/vue3-notification'
import { handleAxiosError } from '@/utils/axios'

export const useTagStore = defineStore('tag', () => {
  
  const tags = ref({} as ITagsResponse)
  
  const fetchTags = async (query: TagQueryDTO) => {
    let myQuery = Object.assign({}, {...query})
    let queryParams = `page=${myQuery.page}&pageSize=${myQuery.pageSize}`;
    if (myQuery.searchString) {
      queryParams += `&searchString=${myQuery.searchString}`   
    } 
      const { execute } = useAxios(GLabsApiClient);
      const result = await execute(`/tags?${queryParams}`, {
       method: "GET"
      });
      if (result.isFinished.value && !result.error.value) {
        tags.value = {...result?.data?.value} as ITagsResponse;
      }
      if (result.error.value) {
        notify({
          title: "Tags API",
          text: `${handleAxiosError(
            result.error.value,
            "Impossible to get your tags at the moment"
          )}`,
          duration: -1,
          type: "error",
        });
      }
  }

  const updateTag = async (tag: ICategoryTag) => {
      const { execute } = useAxios(GLabsApiClient);
      const { used, workshops, ...data} = tag
      const result = await execute(`/tags/${tag.id}`, {
        data: data,
        method: "PATCH"
      });
      if (result.isFinished.value && !result.error.value) {
        const originTagIndex = tags.value?.rows?.findIndex((t) => t.id == tag.id);
        if (originTagIndex) {
          tags.value.rows[originTagIndex] = {...tag}
          notify({
            title: "Tags API",
            text: `${handleAxiosError(
              result.error.value,
              "Your tag was updated successfully"
            )}`,
            duration: 2000,
            type: "success",
          });
        }
      }
      if (result.error.value) {
        notify({
          title: "Tags API",
          text: `${handleAxiosError(
            result.error.value,
            "Impossible to update your tags at the moment"
          )}`,
          duration: -1,
          type: "error",
        });
      }
  }

  const removeTag = async (tag: ICategoryTag) => {
      const { execute } = useAxios(GLabsApiClient);
      const result = await execute(`/tags/${tag.id}`, {
       method: "DELETE"
      });
      if (result.isFinished.value && !result.error.value) {
          const originTagIndex = tags.value?.rows?.findIndex((t) => t.id == tag.id);
          if (originTagIndex) {
            tags.value?.rows?.splice(originTagIndex, 1)
            notify({
              title: "Tags API",
              text: `${handleAxiosError(
                result.error.value,
                "Your tag was removed successfully"
              )}`,
              duration: 2000,
              type: "success",
            });
          }     
        }
      if (result.error.value) {
        notify({
          title: "Tags API",
          text: `${handleAxiosError(
            result.error.value,
            "Impossible to get your tags at the moment"
          )}`,
          duration: -1,
          type: "error",
        });
      }
  }

  const addTag = async (tag: ICategoryTag) => {
    const { execute } = useAxios(GLabsApiClient);
    const { used, workshops, ...data} = tag
    const result = await execute(`/tags`, {
      data: data,
      method: "POST"
    });
    if (result.isFinished.value && !result.error.value) {
      tags.value?.rows?.push({...tag})
      notify({
        title: "Tags API",
        text: `${handleAxiosError(
          result.error.value,
          "Your tag was created successfully"
        )}`,
        duration: 2000,
        type: "success",
      });
    }
    if (result.error.value) {
      notify({
        title: "Tags API",
        text: `${handleAxiosError(
          result.error.value,
          "Impossible to create your tags at the moment"
        )}`,
        duration: -1,
        type: "error",
      });
    }
}

  return { tags, fetchTags, updateTag, removeTag, addTag }
})
