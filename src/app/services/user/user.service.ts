import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { UserResDto } from '../../dto/user/user.res.dto';
import { InsertResDto } from '../../dto/general-response/insert.res.dto';
import { UserReqDto } from '../../dto/user/user.req.dto';

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
