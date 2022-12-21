import type { ITree, IWorkshopMenuItem } from "@/interfaces/workshop";

const buildMenu = (submenu: IWorkshopMenuItem[]): any =>  {
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
  
export { buildMenu }