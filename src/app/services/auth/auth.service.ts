import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginReqDto } from '../../dto/login/login.req.dto';
import { LoginResDto } from '../../dto/login/login.res.dto';
import { BaseService } from '../base/base.service';
import { environment } from '../../../env/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
  ) { }

  login(loginReqDto: LoginReqDto) {
    return this.http.post<LoginResDto>(`${environment.backEndBaseUrl}:${environment.port}/users/login`, loginReqDto)
  }

  saveLoginData(loginResDto: LoginResDto | undefined) {
    localStorage.setItem('dataLogin', JSON.stringify(loginResDto));
  }

  getLoginData() {
    const dataLogin = localStorage.getItem('dataLogin')
    return dataLogin ? JSON.parse(dataLogin) : undefined
  }

  getToken() {
    const dataLogin = this.getLoginData()
    return dataLogin ? dataLogin.token : undefined
  }
}
