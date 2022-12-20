import type { ICustomerRegistration, ICustomerRegistrationDTO, IDriveCustomer } from "@/interfaces";

const handleAxiosError = (error: any, message: string | undefined) => {
  let result = {...error};
  let serverResp = result?.response?.data;
  if (typeof(serverResp)=='object' && serverResp?.message?.length > 0) {
    return `${message}. ${result?.message} - ${serverResp.message}. Please reach out to Global Technical Sales`
  }
  else if (result?.message?.length > 0) {
    return `${message}. ${result?.message}.`
  }
  else {
    result.description = `Error: ${message}`
    return result.description;
  }
}


const generateCustomerPayload = (customer: ICustomerRegistration | IDriveCustomer): ICustomerRegistrationDTO => {
  const {identifiers, ...cust} = customer;
  let temp = {...cust, identifiers: { "create": customer.identifiers }}
  return {...temp}
}

export { handleAxiosError, generateCustomerPayload }