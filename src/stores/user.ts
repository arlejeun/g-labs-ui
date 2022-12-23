// /store/user.js

import { defineStore } from "pinia";
import type {
  IDriveUser,
  IDriveCustomer,
  IDriveUserSettings,
  IDriveUserRegistration,
  IDriveOrg,
  ICustomerRegistrationDTO,
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

  async function updateUserProfile() {
    const { execute } = useAxios(GLabsApiClient);
    const { customer, orgs, groups, settings, ...userProperty } = user.value;
    const { user_id, ...settingsNoUserId } = settings;
    userProperty.settings = { create: settingsNoUserId };
    //const result = await execute(`/users/${user.value.id}`, {method: 'PATCH', data: userProperty}, )
    const result = await execute(`/users/me`, {
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
    customer.value = { ...cust };
    const result = await execute(`/customers/${cust.id}`, {
      data: data,
      method: "PATCH",
    });
    customerUpdateInProgress.value = false;
    if (result.isFinished.value && !result.error.value) {
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
    fetchUser,
    logout,
  };

  // async updatePersonalProfile(user: IDriveUser)
});
