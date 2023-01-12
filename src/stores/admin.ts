import type { Ref } from 'vue'
import { defineStore } from 'pinia'
import { useAxios } from '@vueuse/integrations/useAxios'
import { GLabsApiClient } from '@/apis/glabs'
import type { ICategoryTag, ITagsResponse, IUserGroup, IUserGroupsResponse, IUsersResponse, TagQueryDTO, UserGroupQueryDTO, UsersQueryDTO, WsQueryDTO } from '@/interfaces/workshop'
import { notify } from '@kyvg/vue3-notification'
import { handleAxiosError } from '@/utils/axios'
import type { IDriveUser } from '@/interfaces'

export const useAdminStore = defineStore('admin', () => {
  
  const users = ref({} as IUsersResponse)
  const tags = ref({} as ITagsResponse)
  const userGroups = ref({} as IUserGroupsResponse)
  const businessTags = computed(() => {
    return tags.value?.rows?.filter(x => x.category == 'Business')
  })
  const technicalTags = computed(() => {
    return tags.value?.rows?.filter(x => x.category == 'Technical')
  })

  const currentBaseQuery = ref({page: 1, pageSize:25} as WsQueryDTO)

  const usersQuery = ref({} as UsersQueryDTO)

  const companies = ref([])
  const fetchCompaniesLoV = async () => {
      const { execute } = useAxios(GLabsApiClient);
      const result = await execute(`/users/companies`, {
       method: "GET"
      });
      if (result.isFinished.value && !result.error.value) {
        companies.value = {...result?.data?.value};
      }
      if (result.error.value) {
        notify({
          title: "Users API",
          text: `${handleAxiosError(
            result.error.value,
            "Impossible to get the list of companies at the moment"
          )}`,
          duration: -1,
          type: "error",
        });
      }
  }

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

  const fetchUserGroups = async (query: UserGroupQueryDTO) => {
    let myQuery = Object.assign({}, {...query})
    let queryParams = `page=${myQuery.page}&pageSize=${myQuery.pageSize}`;
    if (myQuery.searchString) {
      queryParams += `&searchString=${myQuery.searchString}`   
    } 
      const { execute } = useAxios(GLabsApiClient);
      const result = await execute(`/user-groups?${queryParams}`, {
       method: "GET"
      });
      if (result.isFinished.value && !result.error.value) {
        userGroups.value = {...result?.data?.value} as IUserGroupsResponse;
      }
      if (result.error.value) {
        notify({
          title: "User Groups API",
          text: `${handleAxiosError(
            result.error.value,
            "Impossible to get user groups at the moment"
          )}`,
          duration: -1,
          type: "error",
        });
      }
  }

  const fetchUsers = async (query: UsersQueryDTO) => {
    let myQuery = Object.assign({page:1, pageSize: 25}, {...query})
    let queryParams = `page=${myQuery.page}&pageSize=${myQuery.pageSize}`;
    if (myQuery.searchString) {
      queryParams += `&searchString=${myQuery.searchString}`   
    } 
    if (myQuery.company) {
      queryParams += `&company=${myQuery.company}`
    }

    if (myQuery.userStatus) {
      queryParams += `&userStatus=${myQuery.userStatus}`
    }

    if (myQuery.userType) {
      queryParams += `&userType=${myQuery.userType}`
    }

      const { execute } = useAxios(GLabsApiClient);
      const result = await execute(`/users?${queryParams}`, {
       method: "GET"
      });
      if (result.isFinished.value && !result.error.value) {
        users.value = {...result?.data?.value} as IUsersResponse;
        usersQuery.value = myQuery
      }
      if (result.error.value) {
        notify({
          title: "Users API",
          text: `${handleAxiosError(
            result.error.value,
            "Impossible to get users at the moment"
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

const updateUserGroup = async (ug: IUserGroup) => {
  const { execute } = useAxios(GLabsApiClient);
  const { workshops, ...data} = ug
  const result = await execute(`/user-groups/${ug.id}`, {
    data: data,
    method: "PATCH"
  });
  if (result.isFinished.value && !result.error.value) {
    const originTagIndex = tags.value?.rows?.findIndex((t) => t.id == ug.id);
    if (originTagIndex) {
      userGroups.value.rows[originTagIndex] = {...ug}
      notify({
        title: "User Group API",
        text: `${handleAxiosError(
          result.error.value,
          "User Group was updated successfully"
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
        "Impossible to update user group at the moment"
      )}`,
      duration: -1,
      type: "error",
    });
  }
}

const removeUser = async (user: IDriveUser) => {
  
}

//TODO: Implementation add User group
const addUserGroup = async (ug: IUserGroup) => {
}

//TODO: Implementation add User group
const removeUserGroup = async (ug: IUserGroup) => {
}

  return {users, usersQuery, tags, businessTags, technicalTags, userGroups, companies, fetchCompaniesLoV, fetchUsers, fetchTags, updateTag, removeTag, addTag, fetchUserGroups, updateUserGroup, addUserGroup, removeUserGroup, removeUser }
})
