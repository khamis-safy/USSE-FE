export interface Automation {
    id:string,
    applicationUserId:string,
    name: string,
    createdAt: string,
    order: number,
    isStopped:string,
    isDeleted:string,
    botActionCount: number,
    botActions: any[],
    criterias:{criteria:string , type:string} [],
    deviceid:string,
    sessionTimeOutMinutes: number,
    sessionTimeOutResponseContent: string
}
