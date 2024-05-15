import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ImageModule } from 'primeng/image';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';

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
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor(private formBuilder: FormBuilder) { }

  onSubmit(): void {
    if (this.loginForm.valid) {
      // Execute login logic
      // Example:
      // this.userService.login(this.loginForm.value).subscribe({
      //   next: (response) => this.userService.saveLoginData(response),
      //   error: (error) => console.error('Login failed:', error),
      //   complete: () => console.log('Login request complete')
      // });
    } else {
      console.log('Form is not valid:', this.loginForm.errors);
    }
  }

  onClicks(): void {
    alert('Click detected');
  }
}
