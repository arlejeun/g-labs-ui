export interface Item {
  name: string;
}

export interface ITag {
  id: number;
  name: string;
}

export interface ICategory extends ITag, ITag {
  category: string
}
export interface IPlatform extends ITag, ITag {}
export interface IDriveGenericUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  phone_number: string;
  avatar_url: string;
  job_function: string;
  company: string;
  date_created: string;
  country_id: number;
  date_updated: string;
  date_approved: string;
  date_lastLogin: string;
  date_expired: string;
  gen_contact_name?: string;
  gen_contact_email?: string;
  [x: string]:
    | string
    | undefined
    | number
    | IDriveOrg[]
    | IDriveUserSettings
    | IDriveUserSettingsDTO
    | IDriveCustomer
    | ITag[]
    | IDriveCustomerRegistration;
}

export interface IDriveRegistrationUser extends IDriveGenericUser {
  orgs: IDriveOrg[];
  settings: IDriveUserSettingsDTO;
  groups: ITag[];
  // customer: IDriveCustomerRegistration
}

export interface IDriveCustomerRegistration {
  create?: ICustomerRegistrationDTO;
}

export interface ICountryConnect {
  connect: { id: number };
}

export interface ICustomerBase {
  first_name: string;
  last_name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface ICustomerRegistration extends ICustomerBase {
  identifiers: IDriveIdentifier[];
}
export interface ICustomerRegistrationDTO extends ICustomerBase {
  identifiers: IDriveIdentifierDTO;
}
export interface ICustomerRegistrationCreate extends ICustomerRegistrationDTO {
  user_id: number;
}

export interface ICustomerRegistrationForm extends ICustomerRegistration {
  emails: IDriveIdentifier[];
  phones: IDriveIdentifier[];
  messengers: IDriveIdentifier[];
}

// export interface ICustomerCreate {
//   create: ICustomerRegistrationDTO
// }

export interface ISettingsCreate {
  create: {
    id_provider: string;
  };
}

export interface IDriveUserRegistration {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  avatar_url: string;
  date_created: string;
  country_id: number;
  date_updated: string;
  date_approved: string;
  date_lastLogin: string;
  date_expired: string;
  country: ICountryConnect;
  //customer: ICustomerCreate,
  settings: ISettingsCreate;
  gen_contact_name: string;
  gen_contact_email: string;
}

export interface IUserGroupsDTO {
  id: number,
  status: string,
  type: string,
  groups: number[]
}

export interface IDriveBaseUser extends IDriveGenericUser {
  customer: IDriveCustomer;
  groups: ITag[];
}
export interface IDriveUser extends IDriveBaseUser {
  orgs: IDriveOrg[];
  settings: IDriveUserSettings;
}

export interface IDriveUserDTO extends IDriveBaseUser {
  orgs: IDriveOrg[];
  settings: IDriveUserSettingsDTO;
}

export interface IDriveUserSettings {
  notifications_channels: string[];
  notifications: boolean;
  locale: string;
  [x: string]: string | string[] | boolean;
}
export interface IDriveUserSettingsDTO {
  create?: IDriveUserSettings;
}
export interface IDriveCustomer extends ICustomerBase {
  [x: string]: string | IDriveIdentifier[];
  identifiers: IDriveIdentifier[];
}
export interface IDriveCustomerDTO {
  [x: string]: string | IDriveIdentifierDTO | IDriveIdentifier[];
  identifiers: IDriveIdentifierDTO;
}

export interface IDriveCustomerForm extends IDriveCustomer {
  emails: IDriveIdentifier[];
  phones: IDriveIdentifier[];
  messengers: IDriveIdentifier[];
}

export interface IDriveCustomerRegistration {
  emails: IDriveIdentifier[];
  phones: IDriveIdentifier[];
  messengers: IDriveIdentifier[];
}

export interface IDriveBaseOrgPending {
  name: string;
  region: string;
  org_uuid: string;
  description?: string;
}

export interface IDriveBaseOrg extends IDriveBaseOrgPending {
  id: number;
  is_owned_by_gts: boolean;
  user_id: number;
}

export interface IDriveOrg extends IDriveBaseOrg {
  org_user_settings: IDriveCustomerOrgSettings;
  org_custom_settings: IDriveCustomerOrgSettings;
}

export interface IDriveOrgDTO extends IDriveBaseOrg {
  org_user_settings: { create: IDriveCustomerOrgSettings };
  org_custom_settings: { create: IDriveCustomerOrgSettings };
}

export interface IDriveIdentifier {
  id?: number;
  name: string;
  type: string;
  value: string;
}

export interface IDriveIdentifierDTO {
  create?: IDriveIdentifier[];
}

export interface IDriveCustomerOrgSettings {
  [x: string]: string | undefined;
}

export interface IDriveProfileActivity {
  content: string;
  timestamp: string;
  size?: string;
  type?: string;
  icon?: string;
  hollow?: boolean;
}

export interface IGenesysCloudRegion {
  [x: string]: string;
}

export interface IDriveCountry {
  id: number;
  name: string;
  dial_code: string;
  code: string;
}


export interface IUserAdminTableElt {
  label: string,
  formatter?: string,
  width?: number | string
}

export interface IUserAdminTable {
  [x:string]: IUserAdminTableElt
}