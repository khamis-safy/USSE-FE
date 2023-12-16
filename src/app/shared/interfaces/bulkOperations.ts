export interface BulkOperations {
    numberOfSuccess: number,
    numberOfErrors: number,
    errorDetails: ErrorDetails[];
}
export interface ErrorDetails{
    errorReason: string,
    errorOnObject: string
}
