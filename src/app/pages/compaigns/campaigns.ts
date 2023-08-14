export interface Campaigns {
  campaignName: string,
  scheduledAt: string,
  isRepeatable: true,
  repeatedDays: number,
  intervalFrom: number,
  intervalTo: number,
  blackoutFrom: string,
  blackoutTo: string,
  maxPerDay: number,
  attachments:string[],
  lists:string[],
  email: string,
  msgBody: string,
  deviceId: string
}
