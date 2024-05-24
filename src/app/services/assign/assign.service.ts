import { Injectable } from "@angular/core";
import { BaseService } from "../base/base.service";
import { PsListResDto } from "../../dto/user/ps-list.res.dto";
import { ClientListResDto } from "../../dto/user/client-list.res.dto";
import { environment } from "../../../env/environment.prod";
import { ClientAssignmentReqDto } from "../../dto/client-assignment/client-assignment.req.dto";
import { InsertResDto } from "../../dto/insert.res.dto";

@Injectable({
    providedIn: 'root'
})

export class AssignService {

    constructor(
        private baseService: BaseService
    ) {}

    getPsList() {
        return this.baseService.get<PsListResDto[]>('users/payroll-service')
    }

    getClientList(id: string) {
        return this.baseService.get<ClientListResDto>(`users/client-assignments/${id}`)
    }

    getImageUrl(id: string) {
        return `${environment.backEndBaseUrl}:${environment.port}/files/${id}`
    }

    createClientAssignment(data: ClientAssignmentReqDto) {
        return this.baseService.post<InsertResDto>('client-assignments', data)
    }
}