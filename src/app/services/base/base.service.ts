import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../../env/environment.prod';
import { ToastrService } from 'ngx-toastr';
import { throwError, catchError, tap } from 'rxjs';

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

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = error.error?.message || 'Internal server error';
    }
    this.toastr.error(errorMessage);
    if (error.status === 401) {
      localStorage.clear();
      this.router.navigateByUrl('/login');
    }
    return throwError(errorMessage);
  }

  private handleResponse<T>(response: T) {
    if (response) {
      const resTemp = response as any;
      if (resTemp['message']) {
        this.toastr.success(resTemp['message']);
      }
    }
    return response;
  }

  get<T>(path: string, withToken: boolean = true) {
    return this.http.get<T>(`${environment.backEndBaseUrl}:${environment.port}/${path}`, withToken ? this.headers : undefined)
      .pipe(
        tap(response => this.handleResponse(response)),
        catchError(this.handleError)
      );
  }

  post<T>(path: string, body: any, withToken: boolean = true) {
    return this.http.post<T>(`${environment.backEndBaseUrl}:${environment.port}/${path}`, body, withToken ? this.headers : undefined)
      .pipe(
        tap(response => this.handleResponse(response)),
        catchError(this.handleError)
      );
  }

  postWithoutHandler<T>(path: string, body: any, withToken: boolean = true) {
    return this.http.post<T>(`${environment.backEndBaseUrl}:${environment.port}/${path}`, body, withToken ? this.headers : undefined)
      .pipe();
  }

  put<T>(path: string, body: any, withToken: boolean = true) {
    return this.http.put<T>(`${environment.backEndBaseUrl}:${environment.port}/${path}`, body, withToken ? this.headers : undefined)
      .pipe(
        tap(response => this.handleResponse(response)),
        catchError(this.handleError)
      );
  }

  patch<T>(path: string, body?: any, withToken: boolean = true) {
    return this.http.patch<T>(`${environment.backEndBaseUrl}:${environment.port}/${path}`, body ? body : null, withToken ? this.headers : undefined)
      .pipe(
        tap(response => this.handleResponse(response)),
        catchError(this.handleError)
      );
  }

  delete<T>(path: string, withToken: boolean = true) {
    return this.http.delete<T>(`${environment.backEndBaseUrl}:${environment.port}/${path}`, withToken ? this.headers : undefined)
      .pipe(
        tap(response => this.handleResponse(response)),
        catchError(this.handleError)
      );
  }
}
