import { Injectable } from '@angular/core';
import { BaseService } from './base/base.service';
import { StepperResDto } from '../dto/stepper/stepper.res.dto';
import { DocumentReqDto } from '../dto/stepper/document.req.dto';
import { InsertResDto } from '../dto/general-response/insert.res.dto';
import { UpdateResDto } from '../dto/general-response/update.res.dto';
import { UpdateCalculatedDocumentReqDto } from '../dto/stepper/update-calculated-document.req.dto';

@Injectable({
  providedIn: 'root',
})
export class PayrollStepperService {
  constructor(private baseService: BaseService) {}

  getDocuments(scheduleId: string) {
    return this.baseService.get<StepperResDto>(`documents/${scheduleId}`);
  }

  saveDocument(body: DocumentReqDto) {
    return this.baseService.patch<UpdateResDto>('documents', body);
  }

  saveFinalDocument(body: UpdateCalculatedDocumentReqDto) {
    return this.baseService.patch<UpdateResDto>('documents/final', body);
  }

  pingClient(scheduleId: string) {
    return this.baseService.post<InsertResDto>(`payrolls/ping/${scheduleId}`);
  }

  getPreviewDocument(documentId: string) {
    return this.baseService.getDocument(`documents/download/${documentId}`);
  }

  getReport(scheduleId: string) {
    return this.baseService.get(`reports/${scheduleId}`);
  }
}
