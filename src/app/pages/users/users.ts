export interface Users {}

export interface UserData{
  email:string,
  organizationName:string,
  id:string,
  refreshToken:string,
  userName:string
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
