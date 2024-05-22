import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { RoleResDto } from '../../models/dto/role/role.res.dto';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private baseService: BaseService) { }

  getAll() {
    return this.baseService.get<RoleResDto[]>(`roles`)
  }
}
