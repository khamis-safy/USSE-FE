export interface DeviceData {
    id: string,
    deviceName: string,
    deviceType: string,
    deviceNumber: string,
    createdAt: string,
    isConnected: boolean,
    instanceId:string,
    isDeleted: boolean,
    applicationUserId: string,
    host: string,
    password: string,
    port: string,
    systemID: string,
    lastUpdate: string,
    token: string
}
export interface Init{
  base64:string,
  sessionName:string,
  token:string,
  isSuccess:boolean,
  errorMessage:string | null
}
export interface CheckCon {
  status:boolean,
  message:string,
  isSuccess:boolean,
  errorMessage:string | null
}
