import { defineStore } from 'pinia'
import type { IWorkshop } from "@/interfaces"
import axios from "axios"
import sanitizeHtml from "sanitize-html"
import type { IWorkshopMenuItem, ITree } from '@/interfaces/workshop'
import { useAxios } from '@vueuse/integrations/useAxios'
import { GLabsApiClient } from '@/apis/glabs'

const WORKSHOPS_BASE = 'https://storage.googleapis.com/genesys-drive-test/'

function buildMenu(submenu: IWorkshopMenuItem[]): any {
  if (typeof submenu.forEach !== 'function') {
    return []
  }

  var result: { name: string; menus: IWorkshopMenuItem[]; pages: IWorkshopMenuItem[] }[] = []
  var menu = {
    name: '',
    menus: [] as IWorkshopMenuItem[],
    pages: [] as IWorkshopMenuItem[]
  }

  submenu.forEach((item: IWorkshopMenuItem) => {
    menu.name = item.name
    menu.menus = []
    if (item.menus && item.menus.length > 0) {
      menu.menus = { ...buildMenu(item.menus) }
    }
    if (item.pages && item.pages.length > 0) {
      menu.pages = { ...buildMenu(item.pages) }
    }
    result.push({ ...menu })
  })
  //  console.log(result)
  return result
}

type IPathMap = {
  path: string,
  index: number[],
  key: number
}
var treeIndex = 0
var pathMap = [] as IPathMap[]

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
export const useWorkshopStore = defineStore({
  id: 'workshop',
  state: () => ({
    workshops: [] as IWorkshop[],
    workshopTree: [] as ITree[],
    workshopTreeKey: 0,
    workShopPathMap: [] as IPathMap[],
    workshopName: '',
    workshop: [] as IWorkshopMenuItem[],
    page_index: [0, 0] as number[], // acces to ws page: menus[1].menus[2] -> page_index is [1,2]
  }),
  getters: {
    getAllWorkshops(): IWorkshop[] {
      return this.workshops
    },
    getWorkshopPages(): IWorkshopMenuItem[] {

      var pages = [] as IWorkshopMenuItem[]
      pages = this.workshop[0]?.menus || []
      for (let i = 0; this.page_index.length - 2; i++) {
        pages = [...pages[i]?.menus || []]
      }
      pages.forEach(page =>
        page.body = page.body?.replaceAll('/images/', `${WORKSHOPS_BASE}${this.workshopName}/images/`)
      )
      return pages
    },

    getWorkshop(): IWorkshopMenuItem[] {
      return this.workshop
    },
    getWorkshopUrl(): string {
      return WORKSHOPS_BASE + this.workshopName + '/'
    },
    getWorkshopMenu(): any {
      return buildMenu(this.workshop)
    },
    getWorkshopTree(): any {
      return this.workshopTree
    },
    getTreeKey(): any {
      return this.workshopTreeKey
    },
    getWorkshopPage(): string {

      if (this.workshop.length === 0) {
        return ''
      }
      var content = [...this.workshop[0]?.menus || []] as IWorkshopMenuItem[]
      var page = ''
      this.page_index.forEach(index => {
        if (content.length > index) {
          page = content[index].body || ''
          content = content[index].menus || []
        }
      })
      page = page.replaceAll('/images/', `${WORKSHOPS_BASE}${this.workshopName}/images/`)

      page = sanitizeHtml(page, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
        allowedIframeHostnames: ['www.youtube.com']
      });
      return page
    },

    workshopEmpty(): Boolean {
      return this.workshops.length <= 0
    },
  },
  actions: {
    async loadWorkshop(id: string) {
      // getting manifest

      let wsId
      this.workshops.forEach((ws => {
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
        this.workshopName = resData.name

        let mnf = resData.manifest
        mnf = mnf.replaceAll('\\"', '\\$')
        mnf = mnf.replaceAll('\"', '"')
        mnf = mnf.replaceAll('\\$', '\\"')

        this.workshop = [JSON.parse(mnf).content] || []

        treeIndex = 0
        this.workshopTree = buildTree(this.workshop[0]?.menus || [])
        this.workShopPathMap = [...pathMap]

      } catch (error) {
        console.error(`Workshop #${id} - manifest cannot be loaded and parsed!\n`, error)
      }

    },
    addWorkshop(todo: IWorkshop) {
      this.workshops.push(todo)
    },

    setWorkshops(workshops: IWorkshop[]) {
      this.workshops = { ...workshops }
    },

    removeWorkshop(index: number) {
      this.workshops.splice(index, 1)
    },

    setTreeIndex(ind: number[]) {
      this.page_index = [...ind]
    },
    setTreeIndexByPath(path: string) {
      const brunches = this.workShopPathMap.filter((item) => { return item.path.substr(2) === path })
      const brunch = brunches[0] || this.workShopPathMap[0]
      this.page_index = brunch.index
      this.workshopTreeKey = brunch.key
    }
  },
})
