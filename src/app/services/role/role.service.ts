import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private baseService: BaseService) { }

  getAll() {
    return this.baseService.get<RoleResDto[]>(`roles`)
  }
}
