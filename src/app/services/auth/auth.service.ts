import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../env/environment.prod';
import { LoginReqDto } from '../../dto/user/login.req.dto';
import { LoginResDto } from '../../dto/user/login.res.dto';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(loginReqDto: LoginReqDto) {
    return this.http.post<LoginResDto>(`${environment.backEndBaseUrl}:${environment.port}/login/`, loginReqDto)
  }

  saveLoginData(loginResDto: LoginResDto | undefined) {
    localStorage.setItem('dataLogin', JSON.stringify(loginResDto));
  }

  getLoginData() {
    const dataLogin = localStorage.getItem('dataLogin');
    return dataLogin ? JSON.parse(dataLogin) : undefined;
  }

  getToken() {
    const dataLogin = this.getLoginData();
    return dataLogin ? dataLogin.token : undefined;
  }

  isLoggedIn() {
    const loginData = this.getLoginData()
    if(loginData) {
      return true
    }
    return false
  }
}

