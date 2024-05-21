import { DocumentsReqDto } from "./documents.req.dto";

export interface DocumentReqDto {
    scheduleId: string,
    documentsReqDto: DocumentsReqDto[]
}