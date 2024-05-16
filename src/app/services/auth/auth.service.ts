import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginReqDto } from '../../models/dto/login/login.req.dto';
import { LoginResDto } from '../../models/dto/login/login.res.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(loginReqDto: LoginReqDto) {
    return this.http.post<LoginResDto>(`http://localhost:8080/users/login`, loginReqDto)
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
