// /store/user.js

import { defineStore } from "pinia";
import type {
  IDriveUser,
  IDriveCustomer,
  IDriveUserSettings,
  IDriveUserRegistration,
  IDriveOrg,
  ICustomerRegistrationDTO,
  IDriveOrgDTO,
  IUserGroupsDTO,
} from "@/interfaces";
import defaultAvatarUrl from "@/assets/images/avatar/01.jpg";
import { GLabsApiClient } from "@/apis/glabs";

import { useAxios } from "@vueuse/integrations/useAxios";
import { useNotification } from "@kyvg/vue3-notification";
import { handleAxiosError } from "@/utils/axios";

import { generateCustomerPayload } from "@/utils/axios";

export const useUserStore = defineStore("identity", () => {
  const router = useRouter();
  const { notify } = useNotification();
  const { width } = useWindowSize()
  
  // state properties vue composition of store
  const registrationUser = ref({} as IDriveUserRegistration);
  const user = ref({} as IDriveUser);
  const status = ref("LoggedOut");
  const registrationStep = ref(-1);
  const token = ref("");
  const customer = ref({} as IDriveCustomer);
  const settings = ref({} as IDriveUserSettings);
  const customerUpdateInProgress = ref(false);
  const userUpdateInProgress = ref(false);
  const orgsUpdateInProgress = ref(false);
  const orgs = ref([] as IDriveOrg[]);
  const localization = useStorage('localization', 'en-US', localStorage)
  const isMobile = computed(() => width.value < 750)

  // computed properties vue composition of store
  const getCustomerProfile = computed(() => {
    return user.value.customer as IDriveCustomer;
  });

  // msal authentication

  const isActive = computed(() => status.value == "Active");
  const isRegistering = computed(() => status.value == "Registration");

  const username = computed(() =>
    user.value?.first_name
      ? `${user.value?.first_name} ${user.value?.last_name}`
      : "Anonymous"
  );
  const userEmail = computed(() => user.value?.email);
  const avatarUrl = computed(() => user.value?.avatar_url || defaultAvatarUrl);
  const isAdmin = computed(() => user.value?.is_admin);
  const getUserData = computed(() => `${user.value}`);
  const isStatusActive = computed(() => user.value?.status == "Active");
  const userId = computed(() => user.value?.id);
  const userType = computed(() => user.value?.type);
  const userCompany = computed(() => user.value?.company);

  //

  async function fetchUser() {
    const { execute } = useAxios(GLabsApiClient);

    const result = await execute("/users/me");

    if (result.isFinished.value && !result.error.value) {
      user.value = result.data.value as IDriveUser;
      status.value = "Active";
      customer.value = user.value?.customer;
      settings.value = user.value?.settings;
      orgs.value = user.value?.orgs;
    }
    if (result.error.value) {
      if (result.error.value?.response?.data?.message == "User not found") {
        router.replace("/registration");
        status.value = "Registration";
        registrationStep.value = 0;
        notify({
          title: "Registration",
          text: `${handleAxiosError(
            result.error.value,
            "No active profile was found with your email account. You can register with this account if you have not done the request before."
          )}`,
          duration: -1,
          type: "info",
        });
      } else if (
        result.error.value?.response?.data?.message ==
        "User not active - status=NeedsApproval"
      ) {
        router.replace("/registration/activate");
        registrationStep.value = 2;
        status.value = "NeedsApproval";
        notify({
          title: "Account Validation",
          text: `${handleAxiosError(
            result.error.value,
            "Your account is under review from Genesys Teams."
          )}`,
          duration: -1,
          type: "info",
        });
      } else {
        notify({
          title: "Identification Error",
          text: `${handleAxiosError(
            result.error.value,
            "Impossible to fetch user profile at the moment"
          )}`,
          duration: -1,
          type: "error",
        });
      }
    }
  }

  async function updateUserProfile(selectedUser?: IDriveUser) {
    const { execute } = useAxios(GLabsApiClient);
    let userProperty= {}
    let endpointEditUser = `/users/me`
    if (typeof selectedUser == 'undefined' ||typeof selectedUser?.id == 'undefined' ) {
      const { customer, orgs, groups, settings, ...userPropertyC } = user.value
      const { user_id, ...settingsNoUserId } = settings;
      userPropertyC.settings = { create: settingsNoUserId };
      userProperty = {...userPropertyC}
    }

    else {
      endpointEditUser = `/users/${selectedUser.id}`
      const { customer, orgs, groups, settings, ...userPropertyC } = selectedUser 
      const { user_id, ...settingsNoUserId } = settings;
      userPropertyC.settings = { create: settingsNoUserId };
      userProperty = {...userPropertyC}
    }
    
    const result = await execute(endpointEditUser, {
      method: "PATCH",
      data: userProperty,
    });
    if (result.isFinished.value && !result.error.value) {
        notify({
          title: "Profile Record",
          text: "Your user profile was updated successfully",
          duration: 2000,
          type: "success",
      });
    }
    if (result.error.value) {
      notify({
        title: "User Profile API",
        text: `${handleAxiosError(
          result.error.value,
          "Impossible to update the user profile at the moment"
        )}`,
        duration: -1,
        type: "error",
      });
    } 
  }

  function extractUserGroupsFromUser (user: IDriveUser, selectedGroups: number[]) {
    const {id, status, type, groups } = user
    return {id: id, status: status, type: type, groups: {connect: selectedGroups.map((x: number) => { return {'id': x}})}}
  }


  async function updateUserGroupsProfile(udpatedUser: IDriveUser, groupIds: number[]) {
    const payload = extractUserGroupsFromUser(udpatedUser, groupIds)
    const { execute } = useAxios(GLabsApiClient);
    let endpointEditUser = `/users/${udpatedUser.id}`
    const result = await execute(endpointEditUser, {
      method: "PATCH",
      data: payload,
    });
    if (result.isFinished.value && !result.error.value) {
        if (result.data.value.id == user.value.id) {
          user.value = result.data.value
        }
        notify({
          title: "Profile Record",
          text: "Your user profile was updated successfully",
          duration: 2000,
          type: "success",
      });
    }
    if (result.error.value) {
      notify({
        title: "User Profile API",
        text: `${handleAxiosError(
          result.error.value,
          "Impossible to update the user profile at the moment"
        )}`,
        duration: -1,
        type: "error",
      });
    } 
  }

  async function updateUserSettingsProfile(udpatedUser: IDriveUser, newSettings: IDriveUserSettings) {
    const {user_id, ...settingsPayload } = newSettings
    const payload = {id: udpatedUser.id, settings: {'create': settingsPayload}}
    //const { user_id, ...settingsNoUserId } = settings;
    //extractUserGroupsFromUser(udpatedUser, groupIds)
    const { execute } = useAxios(GLabsApiClient);
    let endpointEditUser = `/users/${udpatedUser.id}`
    const result = await execute(endpointEditUser, {
      method: "PATCH",
      data: payload,
    });
    if (result.isFinished.value && !result.error.value) {
        if (result.data.value.id == user.value.id) {
          user.value = result.data.value
        }
        notify({
          title: "Profile Record",
          text: "Your user profile was updated successfully",
          duration: 2000,
          type: "success",
      });
    }
    if (result.error.value) {
      notify({
        title: "User Profile API",
        text: `${handleAxiosError(
          result.error.value,
          "Impossible to update the user profile at the moment"
        )}`,
        duration: -1,
        type: "error",
      });
    } 
  }

  async function updateUserContactInfoProfile(udpatedUser: IDriveUser) {
    const {groups, settings, customer, orgs, ...contactInfoPayload } = udpatedUser
    //const { user_id, ...settingsNoUserId } = settings;
    //extractUserGroupsFromUser(udpatedUser, groupIds)
    const { execute } = useAxios(GLabsApiClient);
    let endpointEditUser = `/users/${udpatedUser.id}`
    const result = await execute(endpointEditUser, {
      method: "PATCH",
      data: contactInfoPayload,
    });
    if (result.isFinished.value && !result.error.value) {
        if (result.data.value.id == user.value.id) {
          user.value = result.data.value
        }
        notify({
          title: "Profile Record",
          text: "Your user profile was updated successfully",
          duration: 2000,
          type: "success",
      });
    }
    if (result.error.value) {
      notify({
        title: "User Profile API",
        text: `${handleAxiosError(
          result.error.value,
          "Impossible to update the user profile at the moment"
        )}`,
        duration: -1,
        type: "error",
      });
    } 
  }


  async function createUserProfile(userDTO: IDriveUserRegistration) {
    const { execute } = useAxios(GLabsApiClient);
    const result = await execute(`/users/register`, {
      method: "POST",
      data: userDTO,
    });
    if (result.isFinished.value && !result.error.value) {
      console.log(result.data.value);
      userDTO.user_id = result.data.value.id;
      setUserRegistration(userDTO);
      registrationStep.value = 1;
      status.value = "Registration - Customer";
      notify({
        title: "Account Registration",
        text: "Your user profile was created successfully",
        duration: 2000,
        type: "success",
      });
    }
    if (result.error.value) {
      notify({
        title: "Account Registration",
        text: `${handleAxiosError(
          result.error.value,
          "Impossible to create the user profile at the moment"
        )}`,
        duration: -1,
        type: "error",
      });
    } 
  }

  function setUserRegistration(userDTO: IDriveUserRegistration) {
    registrationUser.value = userDTO;
  }

  async function removeUserProfile() {
    const { execute } = useAxios(GLabsApiClient);
    const result = await execute(`/users/${user.value.id}`, {
      method: "DELETE",
    });
    if (result.isFinished.value && !result.error.value) {
      notify({
        title: "Profile Record",
        text: "Your user profile was deleted successfully",
        duration: 2000,
        type: "success",
      });
    }
    if (result.error.value) {
      notify({
        title: "User Profile API",
        text: `${handleAxiosError(
          result.error.value,
          "Impossible to delete the user profile at the moment"
        )}`,
        duration: -1,
        type: "error",
      });
    } 
  }

  async function updateCustomerProfile(cust: IDriveCustomer) {
    const { execute } = useAxios(GLabsApiClient);
    const data = generateCustomerPayload(cust);
    const result = await execute(`/customers/${cust.id}`, {
      data: data,
      method: "PATCH",
    });
    customerUpdateInProgress.value = false;
    if (result.isFinished.value && !result.error.value) {

      if (result.data.value.customer && result.data.value.customer.id == cust.id) {
        customer.value = result.data.value.customer;
      }

      notify({
        title: "Customer Record",
        text: "Your customer record was updated successfully",
        duration: 2000,
        type: "success",
      });
    }
    if (result.error.value) {
      notify({
        title: "Customer Record Error",
        text: `${handleAxiosError(
          result.error.value,
          "Impossible to update the customer record at the moment"
        )}`,
        duration: -1,
        type: "error",
      });
    } 
  }

  async function createCustomerProfile(cust: ICustomerRegistrationDTO) {
    const { execute } = useAxios(GLabsApiClient);
    const result = await execute(`/customers`, { method: "POST", data: cust });
    if (result.isFinished.value && !result.error.value) {
      registrationStep.value = 2;
      status.value = "Registration - Waiting for Approval";
      notify({
        title: "Account Registration",
        text: "Your customer profile was created successfully",
        duration: 2000,
        type: "success",
      });
    }

    if (result.error.value) {
      notify({
        title: "Account Registration",
        text: `${handleAxiosError(
          result.error.value,
          "Impossible to create the customer profile at the moment"
        )}`,
        duration: -1,
        type: "error",
      });
    } 
  }


  const updateOrganization = async (id: number, org: IDriveOrgDTO) => {
    const { execute } = useAxios(GLabsApiClient);
    const result = await execute(`/users/${id}/org/${org.id}`, {
      data: org,
      method: "PATCH",
    });
    // customerUpdateInProgress.value = false;
    if (result.isFinished.value && !result.error.value) {
      if (result.data.value.id == user.value.id) {
        user.value = result.data.value;
      }
      notify({
        title: "Organization Settings",
        text: "Your organization settings were updated successfully",
        duration: 2000,
        type: "success",
      });
    }
    if (result.error.value) {
      notify({
        title: "Organization Settings Error",
        text: `${handleAxiosError(
          result.error.value,
          "Impossible to update the organization settings at the moment"
        )}`,
        duration: -1,
        type: "error",
      });
    } 
  }

  async function logout() {
    //call msal library
    
    user.value = {} as IDriveUser;
    status.value = "LoggedOut";
  }

  return {
    user,
    settings,
    userId,
    userType,
    userCompany,
    status,
    token,
    customer,
    orgs,
    isRegistering,
    isActive,
    avatarUrl,
    username,
    userEmail,
    isAdmin,
    getCustomerProfile,
    isStatusActive,
    getUserData,
    customerUpdateInProgress,
    userUpdateInProgress,
    orgsUpdateInProgress,
    registrationStep,
    registrationUser,
    localization,
    isMobile,
    setUserRegistration,
    createUserProfile,
    updateUserProfile,
    removeUserProfile,
    createCustomerProfile,
    updateCustomerProfile,
    updateOrganization,
    updateUserGroupsProfile,
    updateUserSettingsProfile,
    updateUserContactInfoProfile,
    fetchUser,
    logout,
  };

  // async updatePersonalProfile(user: IDriveUser)
});
