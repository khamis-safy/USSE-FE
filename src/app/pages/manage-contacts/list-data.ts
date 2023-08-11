export interface ListData {
  id: string,
  name: string,
  totalContacts: number,
  totalCancelContacts: number,
  createdAt: string,
  isDeleted: boolean,
  applicationUserId: string,
  isChecked:boolean,
  selectionState:number,
  contactsNum:number

}
export interface ErrSucc{
  numberOfSuccess:number,
  numberOfErrors: number,
  errorDetails: string[]
}
