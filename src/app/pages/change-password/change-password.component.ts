import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { PasswordReqDto } from '../../dto/user/password.req.dto';
import { firstValueFrom } from 'rxjs';
import { UserService } from '../../services/user/user.service';
import { Router } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'password-app',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    ConfirmDialogModule,
    ToastModule,
  ],
  templateUrl: 'change-password.component.html',
  providers: [ConfirmationService, MessageService],
})
export class ChangePasswordComponent {
  passwordForm = this.formBuilder.group({
    oldPassword: ['', [Validators.required, Validators.minLength(3)]],
    newPassword: ['', [Validators.required, Validators.minLength(3)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(3)]],
  });

  constructor(
    private formBuilder: NonNullableFormBuilder,
    private userService: UserService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  saveEdit() {
    if (this.passwordForm.valid) {
      const newPassword: string = this.passwordForm.value.newPassword as string;
      const confirmPassword: string = this.passwordForm.value
        .confirmPassword as string;
      if (newPassword == confirmPassword) {
        const oldPassword: string = this.passwordForm.value
          .oldPassword as string;

        const passwordReqDto: PasswordReqDto = {
          oldPassword: oldPassword,
          newPassword: newPassword,
        };

        firstValueFrom(this.userService.updatePassword(passwordReqDto)).then(
          (response) => {
            localStorage.clear();
            this.router.navigateByUrl('login');
          },
          (error) => {
            this.passwordForm.reset();
          }
        );
      } else {
        this.messageService.add({
          severity: 'warn',
          summary: 'Invalid Input',
          detail: 'New password and confirm new password must be the same!',
          life: 2500,
        });
        this.passwordForm.reset();
      }
    }
  }

  confirm() {
    this.confirmationService.confirm({
      header: 'Are you sure?',
      message: 'Please confirm to proceed.',
      accept: () => {
        this.saveEdit();
      },
      reject: () => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Rejected',
          detail: 'You have rejected',
          life: 2500,
        });
      },
    });
  }
}
