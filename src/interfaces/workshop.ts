import type { IDriveUser } from "."

export interface ITag {
  id: number,
  name: string,
  category: string
  label?: string
}

export interface ICategoryTag extends ITag {
  used?: number,
  workshops?: { id: number, name: string }[]
}

export interface IUserGroup {
  id: number,
  name: string,
  isActive?: boolean,
  workshops?: { id: number, name: string }[]
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

export interface IUsersResponse extends basicServerResponse {
  rows: IDriveUser[]
}

export interface IPlatform {
  id: number,
  name: string,
  orgId?: string,
  region?: string
}

export interface IWorkshopsResponse extends basicServerResponse {
  rows: IWorkshop[]
}

export interface IWorkshopSettingsResponse extends basicServerResponse {
  rows: IWorkshopSettings[]
}

export interface IWorkshop {
  id?: number,
  title: string,
  description: string,
  locale: string,
  isPublished: boolean,
  isProvisioned: boolean,
  workshop_url?: string,
  manifest?: string,
  settings?: IWorkshopSettings
}

export interface IWorkshopSettings {
  id: number,
  name: string,
  owner: string,
  image_filename: string,
  level: number,
  duration: string,
  tags: ITag[],
  categories?: ITag[],
  environments?: IPlatform[],
  user_groups?: IWorkshopUserGroup[],
  modified_at: string,
  localizations?: any
}


// export interface IWorkshop {
//   id: number,
//   title: string,
//   name: string,
//   owner: string,
//   description: string,
//   active?: boolean,
//   image_filename: string,
//   level: number,
//   duration: string,
//   provisioned: boolean,
//   modified_at: string,
//   workshop_url?: string,
//   manifest?: string,
//   tags: ITag[],
//   categories?: ITag[],
//   environments?: IPlatform[],
//   user_groups?: IWorkshopUserGroup[],
//   localizations: IWorkshopLocalizationForm[]
// }

export interface IWorkshopUserGroup {
  id: number,
  name: string,
  isActive: boolean,
  created_at?: Date,
  updated_at?: Date
}
export interface IWorkshopForm extends IWorkshopSettings {
  groups: number[]
  techTags: number[],
  bizTags: number[],
  envs: number[]
}

export interface IWorkshopLocalizationForm {
  id?: number,
  locale: string,
  title: string,
  description: string,
  active: boolean,
  manifest?: string
}


export interface IWorkshopMenuItem {
  name: string
  weight: number
  path: string
  chapter?: boolean
  locale?: string
  body?: string
  menus?: Array<IWorkshopMenuItem>
  pages?: Array<IWorkshopMenuItem>
  "en-US"?: IWorkshopMenuItem
  "es-ES"?: IWorkshopMenuItem
  "pt-PT"?: IWorkshopMenuItem
  //  [key: string]?: IWorkshopMenuItem
}

export interface ITree {
  id: number
  index: number[]
  path: string
  chapter: boolean,
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
  chapter: boolean,
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


export interface WsFilterClient {
  searchString?: string,
  categories: number[],
  tags: number[]
}

export interface WsFilterCriteria {
  searchString?: string,
  categories: number[],
  tags: number[],
  environments: number,
  levels: number[],
  showAll: boolean
}

export interface WsFilterParams {
  searchString?: string,
  tags: string[]
}
export interface BasicQueryDTO {
  page: number,
  pageSize: number
}


export interface WsFilter {
  searchString?: string,
  tags: number[],
  showAll?: boolean,
  environments?: number
  levels?: number[]
}
export interface WsQueryDTO extends WsFilter, BasicQueryDTO {
}
export interface TagQueryDTO extends BasicQueryDTO {
  searchString?: string,
  category?: string
}


export interface UserGroupQueryDTO extends BasicQueryDTO {
  searchString?: string
}

export interface UsersQueryDTO extends BasicQueryDTO {
  searchString?: string,
  company?: string,
  userStatus?: string,
  userType?: string
}

export interface IWorkshopAdminTableElt {
  label: string,
  formatter?: string,
  width?: string | number
}

export interface IWorkshopAdminTable {
  [x: string]: IWorkshopAdminTableElt
}

export interface IShortCode {
  reg: string,
  replace: string
}
