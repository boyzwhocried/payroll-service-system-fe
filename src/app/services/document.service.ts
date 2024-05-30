import { Injectable } from "@angular/core";
import { DocumentReqDto } from "../dto/document/document.req.dto";
import { OldDocumentResDto } from "../dto/document/old-document.req.dto";
import { UpdateDocumentScheduleReqDto } from "../dto/document/update-document-schedule.req.dto";
import { BaseService } from "./base/base.service";
import { InsertResDto } from "../dto/general-response/insert.res.dto";
import { UpdateResDto } from "../dto/general-response/update.res.dto";

@Injectable({
  providedIn: "root"
})

export class DocumentService {

  constructor(private baseService: BaseService) {}

  addPayrollSchedule(document: DocumentReqDto) {
    return this.baseService.post<InsertResDto>(
      `documents`, document
    )
  }
  getScheduleById(id : string) {
    return this.baseService.get<OldDocumentResDto[]>(
      `documents/original/${id}`
    )
  }
  updateSchedule(body: UpdateDocumentScheduleReqDto[]){
    return this.baseService.patch<UpdateResDto>(
      `documents/schedule`, body
    )
  }
}
