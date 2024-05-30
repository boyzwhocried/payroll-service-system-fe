import { Injectable } from "@angular/core";
import { PayrollResDto } from "../dto/payroll/payroll.res.dto";
import { BaseService } from "./base/base.service";
import { ScheduleResDto } from "../dto/schedule/schedule.res.dto";
import { DocumentReqDto } from "../dto/document/document.req.dto";
import { InsertResDto } from "../dto/general-response/insert.res.dto";
import { OldDocumentResDto } from "../dto/document/old-document.req.dto";
import { UpdateDocumentScheduleReqDto } from "../dto/document/update-document-schedule.req.dto";
import { UpdateResDto } from "../dto/update.res.dto";
import { RescheduleReqDto } from "../dto/schedule/reschedule.req.dto";

@Injectable({
  providedIn: "root"
})

export class PayrollService {

  constructor(private baseService: BaseService) { }

  getAllClients() {
    return this.baseService.get<PayrollResDto[]>(
      `payrolls/clients`)
  }

  getSchedulesByClientId(clientId : string) {
    return this.baseService.get<ScheduleResDto[]>(
      `payrolls/${clientId}`
    )
  }

  getLoginClientSchedule() {
    return this.baseService.get<ScheduleResDto[]>(
      `payrolls`
    )
  }

  createRescheduleRequest(body : RescheduleReqDto) {
    return this.baseService.post<InsertResDto>(
      `payrolls/reschedule`, body
    )
  }
}
