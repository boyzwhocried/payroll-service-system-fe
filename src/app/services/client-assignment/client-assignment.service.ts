import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { ClientAssignmentResDto } from '../../dto/client-assignment/client-assignment.res.dto';

@Injectable({
  providedIn: 'root'
})
export class ClientAssignmentService {

  constructor(private baseService: BaseService) { }

  getClientAssignmentByClientId(clientId: string) {
    return this.baseService.get<ClientAssignmentResDto>(`client-assignments/${clientId}`)
  }
}
