import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, NonNullableFormBuilder } from '@angular/forms';
import { ImageModule } from 'primeng/image';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { AuthService } from '../../services/auth/auth.service';
import { LoginReqDto } from '../../models/dto/login/login.req.dto';

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
  ) { }

  onSubmit(): void {
    if (this.loginForm.valid) {
      // Execute login logic
      // Example:
      const loginReqDto: LoginReqDto = this.loginForm.getRawValue()
      this.authService.login(loginReqDto).subscribe({
        next: (response) => this.authService.saveLoginData(response),
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
