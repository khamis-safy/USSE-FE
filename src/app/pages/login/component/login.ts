import { DeviceData } from "../../devices/device"

export interface Login {
  id:string,
  message: string,
  isAuthenticated: boolean,
  email: string,
  roles:string[],
  token: string,
  refreshToken:string,
  refreshTokenExpiration: string,
  contactName: string,
  organisationName: string,
  trialEndDate: string,
  isActive: boolean,
  isTrial: boolean,
  customerId: string,
  partnerId: string,
  users: any,
  devices: DeviceData[],
  phoneNumber:string;
  apiToken:string,
  apiId: string,
  timeZone:number,
  maskType:string,
  isEmailAuthonticated: boolean,
  subscriptions: {
    name: string,
    value: string
  }[]
}
