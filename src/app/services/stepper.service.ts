import { Injectable } from '@angular/core';
import { BaseService } from './base/base.service';
import { StepperResDto } from '../models/dto/stepper/stepper.res.dto';
import { DocumentReqDto } from '../models/dto/stepper/document.req.dto';
import { InsertResDto } from '../models/dto/insert.res.dto';
import { UpdateResDto } from '../models/dto/update.res.dto';
import { UpdateCalculatedDocumentReqDto } from '../models/dto/stepper/update-calculated-document.req.dto';

@Injectable({
  providedIn: 'root',
})
export class StepperService {
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

  pingClient(clientAssignmentId: string) {
    return this.baseService.post<InsertResDto>(
      `payrolls/ping/${clientAssignmentId}`
    );
  }
}
