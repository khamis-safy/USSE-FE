import { ListData } from "./list-data";

export interface Contacts {
  id: string,
  name:string,
  mobileNumber:string,
  companyName: string,
  note: string,
  isCanceled: boolean,
  isDeleted: boolean,
  createdAt: string,
  isChecked:string,
  // applicationUser: object,
  // applicationUserId:string,
  lists:ListData[]
}


