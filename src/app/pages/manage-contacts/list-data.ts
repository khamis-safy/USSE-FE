export interface ListData {
  id: string,
  name: string,
  totalContacts: number,
  totalCancelContacts: number,
  createdAt: string,
  isDeleted: boolean,
  applicationUserId: string
}
export interface ErrSucc{
  numberOfSuccess:number,
  numberOfErrors: number,
  errorDetails: string[]
}
