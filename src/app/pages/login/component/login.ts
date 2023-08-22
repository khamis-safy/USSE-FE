import { DeviceData } from "../../devices/device"

export interface Login {
  message: string,
  isAuthenticated: boolean,
  email: string,
  roles:string[],
  token: string
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
  apiToken:string,
  apiId: string,
  isEmailAuthonticated: boolean,
  subscriptions: {
    name: string,
    value: string
  }[]
}
