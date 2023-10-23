export interface ListData {
  id: string,
  name: string,
  totalContacts: number,
  totalCancelContacts: number,
  createdAt: string,
  isDeleted: boolean,
  applicationUserId: string,
  isChecked:string,
  selectionState:number,
  contactsNum:number,
  isExpanded:boolean,
  shoudBeClosed:boolean

}
export interface ErrSucc{
  numberOfSuccess:number,
  numberOfErrors: number,
  errorDetails: string[]
}
