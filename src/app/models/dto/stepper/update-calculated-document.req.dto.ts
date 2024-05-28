import { UpdateCalculatedDocumentsReqDto } from './update-calculated-documents.req.dto';

export interface UpdateCalculatedDocumentReqDto {
  scheduleId: string;
  clientAssignmentId: string;
  documents: UpdateCalculatedDocumentsReqDto[];
}
