export interface Users  {
  contactName: string,
  organisationName: string,
  subscriptionStartDate: string,
  lastLogin: string,
  trialEndDate: string,
  isActive: boolean,
  isTrial: boolean,
  customerId: string,
  partnerId: string,
  apiToken: string,
  apiId: string,
  timezone: string,
  isDeleted: boolean,
  maskType: string,
  refreshTokens:
      {
          token:string,
          expiresOn: string,
          isExpired: boolean,
          createdOn: string,
          revokedOn: string,
          isActive: boolean
      } []
 ,
  subscriptions: [],
  permissions: {name:string,value:string}[],
  id: string,
  userName: string,
  normalizedUserName: string,
  email:string,
  normalizedEmail: string,
  emailConfirmed: boolean,
  passwordHash: string,
  securityStamp: string,
  concurrencyStamp: string,
  phoneNumber: string,
  phoneNumberConfirmed: boolean,
  twoFactorEnabled: boolean,
  lockoutEnd: string,
  lockoutEnabled: boolean,
  accessFailedCount: number,
  token:string,
  roles:string

}

export interface UserData{
  email:string,
  organisationName:string,
  id:string,
  refreshToken:string,
  userName:string,
  customerId:string;
  roles:string,
  maskType:string;
  phoneNumber:string;
  apiToken:string,
  timezone:string,
}

export interface Section{
  icon: string,
  label: string,
  name: string,

}

export interface AccessLevels{
  value:string,
  checked:boolean
  // state:string
}
export interface DeviceSections{
  section:Section,
  accessLevels:AccessLevels[],


}
export interface DevicesData{
  deviceId:string,
  sectionsLevels:DeviceSections[];
}
export interface Permission{
  Templates:boolean,
  Bots:boolean,
  Devices:boolean,
  Contacts:boolean


}
export interface Access{
  ReadOnly:boolean,
  FullAccess:boolean,
  None:boolean
}
export interface PermissionData {
  name: string;
  value: string;
}
