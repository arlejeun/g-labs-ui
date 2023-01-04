export interface ITag {
  id: number,
  name: string,
  category: string
  label?: string
}

export interface ICategoryTag extends ITag {
  used?: number,
  workshops?: {id: number, name: string}[]
 }

 export interface IUserGroup {
  id?: number,
  name?: string,
  isActive?: boolean,
  workshops?: {id: number, name: string}[]
 }

export interface basicServerResponse {
  page: number,
  records: number,
}
export interface ITagsResponse extends basicServerResponse {
  rows: ICategoryTag[]
}

export interface IUserGroupsResponse extends basicServerResponse {
  rows: IUserGroup[]
}

export interface IPlatform extends ITag, ITag { }

export interface IWorkshopsResponse extends basicServerResponse {
  rows: IWorkshop[]
}

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

  categories?: ITag[],
  platforms?: IPlatform[],
  permissions_groups?: string[],
  is_public?: boolean,
  is_internal?: boolean,

}

export interface IWorkshopForm extends IWorkshop{
  groups?: number[]
  techTags?: number[],
  bizTags?: number[],
  user_groups?: any,
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


export interface WsFilter {
  searchString?: string,
  categories?: string[],
  tags?: string[]
}

export interface WsQueryDTO extends WsFilter {
  page: number,
  pageSize: number
}

export interface WsQueryDTO extends WsFilter, BasicQueryDTO {
}

export interface BasicQueryDTO {
  page: number,
  pageSize: number
}

export interface TagQueryDTO extends BasicQueryDTO {
  searchString?: string,
  category?: string
}


export interface UserGroupQueryDTO extends BasicQueryDTO {
  searchString?: string
}

export interface IWorkshopAdminTableElt {
  label: string,
  formatter?: string,
  width?: number
}

export interface IWorkshopAdminTable {
  [x:string]: IWorkshopAdminTableElt
}