export interface DocumentReqDto {
  documentId: string;
  documentName: string;
  scheduleId: string;
  base64: string;
  clientAssignmentId: string;
  isSignedByPS: boolean;
  isSignedByClient: boolean;
}
