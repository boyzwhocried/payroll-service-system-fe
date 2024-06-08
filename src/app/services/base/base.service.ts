import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../../env/environment.prod';
import { throwError, tap } from 'rxjs';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class BaseService {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) { }

  private get headers() {
    return {
      headers: {
        Authorization: `Bearer ${this.authService.getToken()}`,
      },
    };
  }

  private response<T>() {
    return tap<T>({
      next: (response) => this.handleResponse(response),
      error: (error) => this.handleError(error)
    })
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = error.error?.message || 'Internal server error';
    }
    this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessage });

    if (error.status === 401) {
      localStorage.clear();
      this.router.navigateByUrl('/login');
    }
    return throwError(() => errorMessage);
  }

  private handleResponse<T>(response: T) {
    if (response) {
      const resTemp = response as any;
      if (resTemp['message']) {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: resTemp['message'] });

      }
    }
    return response;
  }

  get<T>(path: string, withToken: boolean = true) {
    return this.http.get<T>(`${environment.backEndBaseUrl}:${environment.port}/${path}`, withToken ? this.headers : undefined)
      .pipe(this.response<T>())
  }

  post<T>(path: string, body?: any, withToken: boolean = true) {
    return this.http.post<T>(`${environment.backEndBaseUrl}:${environment.port}/${path}`, body, withToken ? this.headers : undefined)
      .pipe(this.response<T>())
  }

  postWithoutHandler<T>(path: string, body: any, withToken: boolean = true) {
    return this.http.post<T>(`${environment.backEndBaseUrl}:${environment.port}/${path}`, body, withToken ? this.headers : undefined)
      .pipe();
  }

  put<T>(path: string, body: any, withToken: boolean = true) {
    return this.http.put<T>(`${environment.backEndBaseUrl}:${environment.port}/${path}`, body, withToken ? this.headers : undefined)
      .pipe(this.response<T>())
  }

  patch<T>(path: string, body?: any, withToken: boolean = true) {
    return this.http.patch<T>(`${environment.backEndBaseUrl}:${environment.port}/${path}`, body ? body : null, withToken ? this.headers : undefined)
      .pipe(this.response<T>())
  }

  delete<T>(path: string, withToken: boolean = true) {
    return this.http.delete<T>(`${environment.backEndBaseUrl}:${environment.port}/${path}`, withToken ? this.headers : undefined)
      .pipe(this.response<T>())
  }

  getDocument(path: string) {
    return this.http.get<HttpResponse<Blob>>(
      `${environment.backEndBaseUrl}:${environment.port}/${path}`,
      {
        responseType: 'blob' as 'json',
        observe: 'response',
      }
    );
  }
}
