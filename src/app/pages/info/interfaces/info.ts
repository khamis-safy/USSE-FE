export interface Info {
    subscribtionName: string,
    subscriptionPrice: number,
    isAPIEnabled: false,
    maxUsersCount: number,
    maxAutomationsCount: number,
    maxDevicesCount: number,
    maxMessagesCount: number,
    currentUsersCount: number,
    currentAutomationsCount: number,
    currentDevicesCount: number,
    currentMessagesCount: number,
    additionalFeature:{name:string ,price : number} []
}
