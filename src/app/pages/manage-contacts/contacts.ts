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
  additionalContactParameter:{name:string, value:string}[],
  hideLeftArrow: boolean,
  hideRightArrow: boolean,
  lists:ListData[]
}


