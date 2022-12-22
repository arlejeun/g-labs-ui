import type { IPathMap, ITree, IWorkshopMenuItem } from "@/interfaces/workshop";
import { useUserStore } from '@/stores/user'

const buildMenu = (submenu: IWorkshopMenuItem[]): any => {
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

let treeIndex = 0
let pathMap = [] as IPathMap[]

const store = useUserStore()
const { localization } = storeToRefs(store)

const buildTree = (ws: IWorkshopMenuItem[], index?: number[]): ITree[] => {
  treeIndex = 0
  pathMap = []
  return _buildTree(ws, index)
}

const _buildTree = (ws: IWorkshopMenuItem[], index?: number[]): ITree[] => {

  if (typeof ws?.forEach !== 'function') {
    return []
  }

  index = index || []
  var result = [] as ITree[]
  var branch = {} as ITree
  var i = 0

  ws.forEach((item: IWorkshopMenuItem) => {
    const loc = localization.value || 'en-US'
    if (loc == 'en-US' && !item.locale ||
      localization.value === item.locale ||
      item[loc]) {

      branch = {} as ITree
      let locItem = { ...item }
      if (item[loc]) {
        locItem = item[loc] as IWorkshopMenuItem
        locItem.menus = item.menus
      }
      branch.index = [...index || []]
      branch.label = locItem.name
      branch.path = locItem.path.substr(0, locItem.path.lastIndexOf('.'))
      branch.path = branch.path.replaceAll(' ', '-')
      branch.path = branch.path.replaceAll('_index', '')
      branch.path = branch.path.replaceAll('_', '-')
      branch.id = treeIndex
      treeIndex++
      branch.index.push(i)
      if (locItem.menus && locItem.menus.length > 0) {
        branch.children = [..._buildTree(locItem.menus, branch.index)]
      }
      pathMap.push({
        path: branch.path,
        index: [...branch.index],
        key: branch.id
      })
      result.push({ ...branch })
      delete branch.children
    }
    i++
  })

  return result

}
export { buildMenu, buildTree, pathMap }