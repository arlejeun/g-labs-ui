export interface ITag {
  id: number,
  name: string
}

export interface ICategory extends ITag, ITag { }
export interface IPlatform extends ITag, ITag { }

export interface IWorkshop {
  id: number,
  title: string,
  name: string,
  owner: string,
  description: string,
  active?: boolean,
  image_filename: string,
  level: number,
  duration: string,
  modified_at: string,
  workshop_url?: string,
  manifest?: string,
  tags: ITag[],

  categories?: ICategory[],
  platforms?: IPlatform[],
  permissions_groups?: string[],
  is_public?: boolean,
  is_internal?: boolean,

  /*
    image: string,
    is_public?: boolean,
    is_internal?: boolean,
    permissions_groups: string[],
    categories: ICategory[],
    tags: ITag[],
    platforms: IPlatform[],
    active?: boolean,
    id: string,
    title: string,
    level: number,
    duration: string,
    description: string,
    workshop_url: URL
    modified_at?: Date,
    author?: string,
    name?: string
  */
}



export interface IWorkshopMenuItem {
  name: string
  weight: number
  path: string
  locale?: string
  body?: string
  menus?: Array<IWorkshopMenuItem>
  pages?: Array<IWorkshopMenuItem>
  "en-US"?: IWorkshopMenuItem
  "es-ES"?: IWorkshopMenuItem
  "pt-PT"?: IWorkshopMenuItem
}

export interface ITree {
  id: number
  index: number[]
  path: string
  body?: string
  label: string
  isTop?: boolean
  disabled: boolean
  isSelected?: boolean
  children?: ITree[]

}

export type IPathMap = {
  path: string,
  index: number[],
  key: number
}

export type IWsBreadcrumb = {
  title: string,
  path: string
}

export enum WS {
  Home,
  Workshops,
  Title,
  Section,
  Chapter
}