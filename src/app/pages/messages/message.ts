import { DeviceData } from "../devices/device"

export interface Message {
    id: string,
    deviceid:string,
    device: DeviceData | null,
    targetPhoneNumber: string,
    direction: boolean,
    attachments: string | null,
    msgBody:string,
    createdAt:string,
    updatedAt: string | null,
    isDeleted: boolean,
    isSeened: boolean,
    status: number | null,
    applicationUserId: string,
    msgType:string,
    fileName: string | null,
    fileUrl: string | null,
    campaignId: string | null,
    chat:ChatData
}
export interface Shceduled{
  id:string,
  msgType: "WPP",
  targetPhoneNumber:{number:string} [],
  attachments: [],
  msgBody: string,
  scheduledAt: string,
  createdAt: string,
  device: DeviceData,
  chat:ChatData

}
export interface SendData{
  deviceid: string,
  targetPhoneNumber:   {
    number: string,
    name: string
  }[],
  attachments:string[],
  msgBody: string,
  scheduledAt:string,
  email: string
}
export interface ChatData{

    id: string,
    chatName: string,
    targetPhoneNumber: string,
    createdAt: string,
    isDeleted: boolean

}
