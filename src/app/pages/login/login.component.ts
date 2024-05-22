import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Validators, ReactiveFormsModule, NonNullableFormBuilder } from '@angular/forms';
import { ImageModule } from 'primeng/image';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { AuthService } from '../../services/auth/auth.service';
import { LoginReqDto } from '../../dto/user/login.req.dto';
import { Router } from '@angular/router';
import { RoleType } from '../../constants/roles.constant';

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
    private router: Router
  ) { }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const loginReqDto: LoginReqDto = this.loginForm.getRawValue()
      this.authService.login(loginReqDto).subscribe({
        next: (response) => {
          this.authService.saveLoginData(response)
          console.log(response)
          const roleCode: string = response.roleCode
          if (roleCode == RoleType.SUPER_ADMIN) {
            this.router.navigateByUrl('/users')
          } else if (roleCode == RoleType.PS) {
            
          } else if (roleCode == RoleType.CLIENT) {
            
          }
        },
        error: (error) => console.error('Login failed:', error),
        complete: () => console.log('Login request complete')
      });
    } else {
      console.log('Form is not valid:', this.loginForm.errors);
    }
  }

  onClicks(): void {
    alert('Click detected');
  }
}