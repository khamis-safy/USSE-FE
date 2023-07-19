export interface Device {
  base64:string,
  sessionName:string,
  token:string,
  isSuccess:boolean,
  errorMessage:string | null
}
export interface CheckCon {
  status:boolean,
  message:string,
  isSuccess:boolean,
  errorMessage:string | null
}
