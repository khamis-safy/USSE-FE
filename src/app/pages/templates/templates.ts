export interface Templates {
    id:string,
    templateName: string,
    messageBody: string,
    createdAt: string,
    attachments: Attatchment[]
}
export interface Attatchment{
  fileUrl: string,
  fileName: string
}
