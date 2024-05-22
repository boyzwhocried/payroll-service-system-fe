export interface DocumentReqDto {
  documentId: string;
  documentName: string;
  base64: string;
  clientAssignmentId: string;
  isSignedByPS: boolean;
}
