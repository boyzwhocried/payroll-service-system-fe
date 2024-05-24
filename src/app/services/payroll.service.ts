import { Injectable } from "@angular/core";
import { PayrollResDto } from "../dto/payroll/payroll.res.dto";
import { BaseService } from "./base/base.service";
import { ScheduleResDto } from "../dto/schedule/schedule.res.dto";
import { DocumentReqDto } from "../dto/document/document.req.dto";
import { InsertResDto } from "../dto/general-response/insert.res.dto";

@Injectable({
  providedIn: "root"
})

export class PayrollService {

  constructor(private baseService: BaseService) { }

  getAllClients() {
    return this.baseService.get<PayrollResDto[]>(
      `payrolls/clients`)
  }

  getSchedulesByClientId(id : string) {
    return this.baseService.get<ScheduleResDto[]>(
      `payrolls/${id}`
    )
  }
  addPayrollSchedule(document: DocumentReqDto) {
    return this.baseService.post<InsertResDto>(
      `documents`, document
    )
  }

}
