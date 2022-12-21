// /store/user.js

import { defineStore } from "pinia";
import type {
  IWorkshop, ITree, IWorkshopMenuItem, IPathMap
} from "@/interfaces/workshop";
import sanitizeHtml from "sanitize-html"
import { GLabsApiClient } from "@/apis/glabs";

import { useAxios } from "@vueuse/integrations/useAxios";
import { useNotification } from "@kyvg/vue3-notification";
import { buildMenu } from "@/utils/workshop_utils";

const WORKSHOPS_BASE = import.meta.env.VITE_GLABS_GCP_CONTENT

let treeIndex = 0
let pathMap = [] as IPathMap[]

const buildTree = (ws: IWorkshopMenuItem[], index?: number[]): ITree[] => {

  if (typeof ws?.forEach !== 'function') {
    return []
  }

  index = index || []
  var result = [] as ITree[]
  var branch = {} as ITree
  var i = 0

  ws.forEach((item: IWorkshopMenuItem) => {
    branch.index = [...index || []]
    branch.label = item.name
    branch.path = item.path.substr(0, item.path.lastIndexOf('.'))
    branch.id = treeIndex
    treeIndex++
    branch.index.push(i)
    if (item.menus && item.menus.length > 0) {
      branch.children = [...buildTree(item.menus, branch.index)]
    }
    pathMap.push({
      path: branch.path,
      index: [...branch.index],
      key: branch.id
    })
    result.push({ ...branch })
    delete branch.children
    i++
  })

  return result

}

export const useWorkshopStore = defineStore("workshop", () => {
  
  const router = useRouter();
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

  async function fetchUser() {
  }
  
  async function loadWorkshop(id: string) {
    // getting manifest

    let wsId
    workshops.value.forEach((ws => {
      if (ws.name == id) {
        wsId = ws.id
      }
    }))

    if (!wsId) {
      console.error('Could not get Workshop ID!')
      // return
    }

    wsId = 2
    try {

      const { execute } = useAxios(GLabsApiClient)
      const result = await execute(`/workshops/${wsId}`)
      const resData = result.data.value
      workshopName.value = resData.name
      let mnf = resData.manifest
      mnf = mnf.replaceAll('\\"', '\\$')
      mnf = mnf.replaceAll('\"', '"')
      mnf = mnf.replaceAll('\\$', '\\"')

      workshop.value = [JSON.parse(mnf).content] || []
      treeIndex = 0
      workshopTree.value = buildTree(workshop.value[0]?.menus || [])
      workShopPathMap.value = [...pathMap]

    } catch (error) {
      console.error(`Workshop #${id} - manifest cannot be loaded and parsed!\n`, error)
    }

  }

  function addWorkshop(todo: IWorkshop) {
    workshops.value.push(todo)
  }

  function setWorkshops(ws: IWorkshop[]) {
    workshops.value = [...ws]
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
    loadWorkshop,
    addWorkshop,
    setWorkshops,
    removeWorkshop,
    setTreeIndex,
    setTreeIndexByPath
  };

  // async updatePersonalProfile(user: IDriveUser)
});

