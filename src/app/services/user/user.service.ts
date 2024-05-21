import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { UserResDto } from '../../models/dto/user/user.res.dto';
import { UserReqDto } from '../../models/dto/user/user.req.dto';
import { InsertResDto } from '../../models/dto/insert.res.dto';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private baseService: BaseService) { }


  getAll() {
    return this.baseService.get<UserResDto[]>(`users`)
  }

  getUsersByRole(roleCode: string) {
    return this.baseService.get<UserResDto[]>(`users/role/${roleCode}`)
  }

  getUserById(id: number) {
    return this.baseService.get<UserResDto>(`users/${id}`)
  }

  addUser(user: UserReqDto) {
    return this.baseService.post<InsertResDto>(`users`, user)
  }
}
