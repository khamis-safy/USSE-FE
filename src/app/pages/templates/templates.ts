export interface Templates {
    id:string,
    templateName: string,
    messageBody: string[],
    createdAt: string,
    attachments:string[]

}
export interface Attatchment{
  fileUrl: string,
  fileName: string
}
export interface Init{
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
