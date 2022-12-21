import type { IPathMap, ITree, IWorkshopMenuItem } from "@/interfaces/workshop";

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
    // todo check language
    branch.index = [...index || []]
    branch.label = item.name
    branch.path = item.path.substr(0, item.path.lastIndexOf('.'))
    branch.path = branch.path.replaceAll(' ', '-')
    branch.path = branch.path.replaceAll('_index', '')
    branch.path = branch.path.replaceAll('_', '-')
    branch.id = treeIndex
    treeIndex++
    branch.index.push(i)
    if (item.menus && item.menus.length > 0) {
      branch.children = [..._buildTree(item.menus, branch.index)]
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
export { buildMenu, buildTree, pathMap }