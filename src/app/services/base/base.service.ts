import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../../env/environment.prod';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class BaseService {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  private get headers() {
    return {
      headers: {
        Authorization: `Bearer ${this.authService.getToken()}`,
      },
    };
  }

  private response<T>() {
    return tap<T>({
      next: (response) => {
        if (response) {
          const resTemp = response as any;
          if (resTemp['message']) {
            this.toastr.success(resTemp['message']);
          }
        }
      },
      error: (error) => {
        if (error['status'] == 401) {
          this.toastr.error(error['message']);
          localStorage.clear();
          this.router.navigateByUrl('/login');
        } else {
          console.error('An unexpected error occurred:', error);
        }
      },
    });
  }

  get<T>(path: string, withToken: boolean = true) {
    return this.http
      .get<T>(
        `${environment.backEndBaseUrl}:${environment.port}/${path}`,
        withToken ? this.headers : undefined
      )
      .pipe(this.response<T>());
  }

  post<T>(path: string, body?: any, withToken: boolean = true) {
    return this.http
      .post<T>(
        `${environment.backEndBaseUrl}:${environment.port}/${path}`,
        body ? body : null,
        withToken ? this.headers : undefined
      )
      .pipe(this.response<T>());
  }

  put<T>(path: string, body: any, withToken: boolean = true) {
    return this.http
      .put<T>(
        `${environment.backEndBaseUrl}:${environment.port}/${path}`,
        body,
        withToken ? this.headers : undefined
      )
      .pipe(this.response<T>());
  }

  patch<T>(path: string, body: any, withToken: boolean = true) {
    return this.http
      .patch<T>(
        `${environment.backEndBaseUrl}:${environment.port}/${path}`,
        body,
        withToken ? this.headers : undefined
      )
      .pipe(this.response<T>());
  }
}
