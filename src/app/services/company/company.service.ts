import { Injectable } from "@angular/core";
import { BaseService } from "../base/base.service";
import { CompanyResDto } from "../../dto/company/company.res.dto";
import { environment } from "../../../env/environment.prod";
import { UpdateCompanyReqDto } from "../../dto/company/update-company.req.dto";
import { UpdateResDto } from "../../dto/general-response/update.res.dto";
import { DefaultPicture } from "../../constants/default-profile.constant";
import { map } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class CompanyService {

    constructor(
        private baseService: BaseService
    ) { }

    getCompanies() {
        return this.baseService.get<CompanyResDto[]>(`companies`).pipe(map(users => users.map(user => this.setDefaultProfilePicture(user))))
    }

    getImageUrl(id: string) {
        return `${environment.backEndBaseUrl}:${environment.port}/files/${id}`
    }

    updateCompanyData(data: UpdateCompanyReqDto) {
        return this.baseService.patch<UpdateResDto>('companies', data)
    }

    private setDefaultProfilePicture(user: CompanyResDto): CompanyResDto {
        if (!user.companyLogoContent || !user.companyLogoExtension) {
            user.companyLogoContent = DefaultPicture.DEFAULT_COMPANY_PICTURE_CONTENT
            user.companyLogoExtension = 'jpg';
        }
        return user;
    }
}