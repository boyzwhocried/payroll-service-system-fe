export interface DocumentsResDto {
  documentId: string;
  documentName: string;
  documentDirectory: string;
  activity: string;
  documentDeadline: string;
  isSignedByPs: boolean;
  isSignedByClient: boolean;
}
