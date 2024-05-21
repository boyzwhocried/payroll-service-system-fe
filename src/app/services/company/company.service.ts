import { Injectable } from "@angular/core";
import { BaseService } from "../base/base.service";
import { CompanyResDto } from "../../dto/company/company.res.dto";
import { environment } from "../../../env/environment.prod";

@Injectable({
    providedIn: 'root'
})

export class CompanyService {


    constructor(
        private baseService: BaseService
    ) {}

    getCompanies() {
        return this.baseService.get<CompanyResDto[]>(`companies`)
    }

    getImageUrl(id: string) {
        return `${environment.backEndBaseUrl}:${environment.port}/files/${id}`
    }
}