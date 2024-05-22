import { Injectable } from "@angular/core";
import { PayrollResDto } from "../dto/payroll/payroll.res.dto";

import { BaseService } from "./base/base.service";
import { PayrollResDto } from "../dto/payroll/payroll.res.dto";

@Injectable({
  providedIn: "root"
})

export class PayrollService {

  constructor(private baseService: BaseService) { }

  getAllClients() {
    return this.baseService.get<PayrollResDto[]>(
      `/payrolls/clients`)
  }
}
