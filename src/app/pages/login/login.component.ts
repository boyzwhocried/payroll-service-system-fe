import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Validators, ReactiveFormsModule, NonNullableFormBuilder } from '@angular/forms';
import { ImageModule } from 'primeng/image';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { AuthService } from '../../services/auth/auth.service';
import { LoginReqDto } from '../../dto/user/login.req.dto';
import { Router, RouterModule } from '@angular/router';
import { RoleType } from '../../constants/roles.constant';
import { firstValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ImageModule,
    ButtonModule,
    InputTextModule,
    RippleModule,
    RouterModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],

})
export class LoginComponent {
  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(3)]],
  });

  constructor(
    private formBuilder: NonNullableFormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
  ) { }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const loginReqDto: LoginReqDto = this.loginForm.getRawValue()
      firstValueFrom(this.authService.login(loginReqDto)).then(
        next => {
          this.authService.saveLoginData(next)
          const roleCode: string = next.roleCode
          this.router.navigateByUrl(roleCode == RoleType.SUPER_ADMIN ? '/users' : '/schedules')
        },
        error => this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.message })
      )
    } else {
      console.log('Form is not valid:', this.loginForm.errors);
    }
  }
}