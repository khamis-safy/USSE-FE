export interface Chats {
chat: chat,
lastMessageDate: string,
lastMessageContent: string,
lastMessageDirection: boolean,
lastMessageStatus: number,
unseenMessagesCount:number
}
interface chat{
    id: string,
    chatName:string,
    targetPhoneNumber: string,
    createdAt: string,
    isDeleted: boolean
}
export interface ChatById   {
    id: string,
    deviceid: string,
    device: any,
    targetPhoneNumber: string,
    direction: boolean,
    chat:chat,
    msgBody: string,
    createdAt: string,
    updatedAt: string,
    isDeleted: false,
    isSeened: boolean,
    status: number,
    applicationUserId:string,
    msgType: string,
    fileName: any,
    fileUrl: any,
    campaignId: any,
    actionCount: any,
    isReply: false,
    isEnquiry: false,
    enquiryQuestion: number,
    botId: any,
    isCampaignAction: false
}