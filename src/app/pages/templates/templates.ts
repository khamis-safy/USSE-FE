export interface Templates {
    id:string,
    templateName: string,
    messageBody: string,
    createdAt: string,

    attachments:Attatchment[]


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
export interface TemplateData{
  result:ResultsData,
  id: number,
  exception:string | null,
  status: number,
  isCanceled: boolean,
  isCompleted: boolean,
  isCompletedSuccessfully: boolean,
  creationOptions: number,
  asyncState: string | null,
  isFaulted: boolean
}
export interface ResultsData{
  id: string,
  templateName:string,
  messageBody:string,
  createdAt: string,
  attachments:string []
}
