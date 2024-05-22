import { Injectable } from "@angular/core";
import { PayrollsResDto } from "../../dto/payrolls/payrolls.res.dto";
import { BaseService } from "../base/base.service";

@Injectable({
  providedIn: "root"
})

export class PayrollService {

  constructor(private baseService: BaseService) { }

  getAllClients() {
    return this.baseService.get<PayrollsResDto[]>(
      `/payrolls/clients`)
  }
}
