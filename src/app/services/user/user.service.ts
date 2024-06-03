import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { InsertResDto } from '../../dto/general-response/insert.res.dto';
import { UpdateResDto } from '../../dto/general-response/update.res.dto';
import { UserReqDto } from '../../dto/user/user.req.dto';
import { UserResDto } from '../../dto/user/user.res.dto';
import { ProfileResDto } from '../../dto/user/profile.res.dto';
import { PasswordReqDto } from '../../dto/user/password.req.dto';
import { UpdateUserReqDto } from '../../dto/user/update-user.req.dto';
import { environment } from '../../../env/environment.prod';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  file = {
    fileContent : '',
    fileExtension : ''
  }

  fileObserver: any
  fileObservable = new Observable(subscriber => this.fileObserver = subscriber)

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

  editUser(user: UserReqDto) {
    return this.baseService.patch<UpdateResDto>(`users`, user)
  }

  getProfile() {
    return this.baseService.get<ProfileResDto>('users/profile')
  }

  getImageUrl(id?: string) {
    return `${environment.backEndBaseUrl}:${environment.port}/files/${id}`
  }

  updateUser(data: UpdateUserReqDto) {
    if (data.fileContent) {
      this.file.fileContent = data.fileContent
      this.file.fileExtension = data.fileExtension
      this.fileObserver.next(this.file)
    }
    return this.baseService.patch<UpdateResDto>('users', data)
  }

  updatePassword(data: PasswordReqDto) {
    return this.baseService.patch<UpdateResDto>('users/password', data)
  }
}
