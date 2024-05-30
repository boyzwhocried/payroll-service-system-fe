import { Injectable } from "@angular/core";
import { PayrollResDto } from "../dto/payroll/payroll.res.dto";
import { BaseService } from "./base/base.service";
import { ScheduleResDto } from "../dto/schedule/schedule.res.dto";
import { InsertResDto } from "../dto/general-response/insert.res.dto";
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
