import { Injectable } from "@angular/core";
import { BaseService } from "./base/base.service";
import { PayrollsResDto } from "../dto/payrolls/payrolls.res.dto";

@Injectable({
  providedIn: "root"
})

export class PayrollService {

  constructor(private baseService : BaseService) {}

  getAllClients() {
    return this.baseService.get<PayrollsResDto[]>(
      `/payrolls/clients`)
  }
}
