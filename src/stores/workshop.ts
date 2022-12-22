// /store/user.js

import { defineStore } from "pinia";
import type {
  IWorkshop, ITree, IWorkshopMenuItem, IPathMap
} from "@/interfaces/workshop";
import sanitizeHtml from "sanitize-html"
import { GLabsApiClient } from "@/apis/glabs";

import { useAxios } from "@vueuse/integrations/useAxios";
import { useNotification } from "@kyvg/vue3-notification";
import { buildMenu, buildTree, pathMap } from "@/utils/workshop_utils";
import { handleAxiosError } from "@/utils/axios";

const WORKSHOPS_BASE = import.meta.env.VITE_GLABS_GCP_CONTENT
const config = {
	headers: {
		Authorization: 'Bearer TBD',
		Accept: 'application/json, text/plain, */*'
	}
};

export const useWorkshopStore = defineStore("workshop", () => {

  const route = useRoute();

  const { notify } = useNotification();

  // state properties vue composition of store
  //const registrationUser = ref({} as IDriveUserRegistration);
  const workshops = ref([] as IWorkshop[])
  const workshopTree = ref([] as ITree[])
  const workshopTreeKey = ref(0)
  const workShopPathMap = ref([] as IPathMap[])
  const workshopName = ref('')
  const workshop = ref([] as IWorkshopMenuItem[])
  const page_index = ref([0, 0] as number[])

  // computed properties vue composition of store
  // const getAllWorkshops = computed(() => {
  //   return workshops.value
  // })

  const getWorkshopPages = computed(() => {
    let pages = [] as IWorkshopMenuItem[]
    pages = workshop.value[0]?.menus || []
    for (let i = 0; page_index.value.length - 2; i++) {
      pages = [...pages[i]?.menus || []]
    }
    pages.forEach(page =>
      page.body = page.body?.replaceAll('/images/', `${WORKSHOPS_BASE}${workshopName.value}/images/`)
    )
    return pages
  })

  const getWorkshopUrl = computed(() => {
    return WORKSHOPS_BASE + workshopName.value + '/'
  })

  const getWorkshopMenu = computed(() => {
    return buildMenu(workshop.value)
  })

  const workshopTitle = computed(
    () =>
      (getWorkshopMenu.value.length > 0 && getWorkshopMenu.value[0].name) || ""
  );

  const workshopMenu = computed(
    () => getWorkshopMenu.value.length > 0 && getWorkshopMenu.value[0].menus
  );


  const getWorkshopPage = computed(() => {
    if (workshop.value.length === 0) {
      return ''
    }
    let content = [...workshop.value[0]?.menus || []] as IWorkshopMenuItem[]
    let page = ''
    page_index.value.forEach(index => {
      if (content.length > index) {
        page = content[index].body || ''
        content = content[index].menus || []
      }
    })
    page = page.replaceAll('/images/', `${WORKSHOPS_BASE}${workshopName.value}/images/`)

    page = sanitizeHtml(page, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
      allowedIframeHostnames: ['www.youtube.com']
    });
    return page
  })

  const workshopEmpty = computed(() => {
    workshops.value.length <= 0
  })

  async function loadWorkshopById(id: string) {
    if (!id) {
      return
    }
    let wsId
    workshops.value.forEach((ws => {
      if (ws.name == id) {
        wsId = ws.id
      }
    }))

    if (!wsId) {
      wsId = 10
      console.error('Could not get Workshop ID!')
    }

    try {
      const { execute } = useAxios(GLabsApiClient)
      const result = await execute(`/workshops/${wsId}`)
      if (result.isFinished.value && !result.error.value) {
        const resData = result.data.value
        workshopName.value = resData.name
        let mnf = resData.manifest
        mnf = mnf.replaceAll('\\"', '\\$')
        mnf = mnf.replaceAll('\"', '"')
        mnf = mnf.replaceAll('\\$', '\\"')
        workshop.value = [JSON.parse(mnf).content] || []
        workshopTree.value = buildTree(workshop.value[0]?.menus || [])
        workShopPathMap.value = [...pathMap]
        
        /*** Test  */
        let urlParam = route.params.all.toString()
        const slashIdx = urlParam.indexOf('/')
        urlParam = urlParam.substr(slashIdx+1) 
        setTreeIndexByPath(urlParam);
        /*** End Test */
  //   tree.value!.setCurrentKey(workshopTreeKey.value, true); 
      }
      if (result.error.value) {
        notify({
          title: `Workshop - ${wsId} is not available at the moment`,
          text: `${handleAxiosError(
            result.error.value,
            "Impossible to retrieve the workshop manifest at the moment"
          )}`,
          duration: -1,
          type: "error",
        });
      } 

    } catch (error) {
      console.error(`Workshop #${id} - manifest cannot be loaded and parsed!\n`, error)
    }

  }

  function addWorkshop(todo: IWorkshop) {
    workshops.value.push(todo)
  }

  function loadWorkshops() {
    const { data, isLoading, isFinished: isWorkshopsLoaded, error } = useAxios('/workshops', config, GLabsApiClient)
    watch(isWorkshopsLoaded, () => {
      workshops.value = [...data.value]
    })
    if (error.value) {
      notify({
        title: `Workshops Issue`,
        text: `${handleAxiosError(
          error.value,
          `Workshops are not available at the moment`
        )}`,
        duration: -1,
        type: "error",
      });
    } 
    
  }

  function removeWorkshop(index: number) {
    workshops.value.splice(index, 1)
  }

  function setTreeIndex(ind: number[]) {
    page_index.value = [...ind]
  }

  function setTreeIndexByPath(path: string) {
    const brunches = workShopPathMap.value.filter((item) => { return item.path.substr(2) === path })
    const brunch = brunches[0] || workShopPathMap.value[0]
    page_index.value = brunch.index
    workshopTreeKey.value = brunch.key
  }

  return {
    workshops,
    workshopTree,
    workshopTreeKey,
    workShopPathMap,
    workshopName,
    workshop,
    page_index,
    getWorkshopPages,
    getWorkshopUrl,
    getWorkshopMenu,
    getWorkshopPage,
    workshopEmpty,
    workshopTitle, 
    workshopMenu,
    loadWorkshops,
    loadWorkshopById,
    addWorkshop,
    removeWorkshop,
    setTreeIndex,
    setTreeIndexByPath
  };

  // async updatePersonalProfile(user: IDriveUser)
});

