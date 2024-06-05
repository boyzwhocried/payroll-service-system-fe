import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ImageModule } from 'primeng/image';
import { ProfileResDto } from '../../dto/user/profile.res.dto';
import { UserService } from '../../services/user/user.service';
import { firstValueFrom } from 'rxjs';
import { UpdateUserReqDto } from '../../dto/user/update-user.req.dto';
import { InputMaskModule } from 'primeng/inputmask';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'profile-app',
  imports: [
    CommonModule,
    AvatarModule,
    InputTextModule,
    ButtonModule,
    ReactiveFormsModule,
    ImageModule,
    InputMaskModule,
    ConfirmDialogModule,
    ToastModule,
  ],
  standalone: true,
  templateUrl: './profile.component.html',
  providers: [ConfirmationService, MessageService],
})
export class ProfileComponent implements OnInit {
  profileRes: ProfileResDto | undefined;
  isEditable: boolean = false;
  isHover: boolean = false;

  @ViewChild('fileInput') fileInput!: ElementRef;

  updateUserForm = this.formBuilder.group({
    id: ['', [Validators.required]],
    userName: ['', [Validators.minLength(3)]],
    email: ['', [Validators.email]],
    phoneNumber: ['', [Validators.minLength(13)]],
    roleId: [''],
    fileContent: [''],
    fileExtension: [''],
  });

  constructor(
    private formBuilder: NonNullableFormBuilder,
    private userService: UserService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.init();
  }

  init() {
    firstValueFrom(this.userService.getProfile()).then((response) => {
      this.profileRes = response;
      this.updateUserForm.patchValue({
        id: response.userId,
      });
    });
  }

  generateImage(id?: string) {
    if (id) {
      return this.userService.getImageUrl(id);
    }
    return '';
  }

  generateNewImage(
    contentData?: string | undefined,
    extension?: string | undefined
  ): string {
    return `data:image/${extension};base64,${contentData}`;
  }

  toogleEdit() {
    this.isEditable = !this.isEditable;
  }

  onAvatarClick(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        this.updateUserForm.patchValue({
          fileContent: base64,
          fileExtension: file.type.split('/')[1],
        });
      };
      reader.readAsDataURL(file);
    }
  }

  isImageInput() {
    return (
      this.updateUserForm.value.fileContent &&
      this.updateUserForm.value.fileExtension
    );
  }

  closeEdit() {
    this.updateUserForm.reset();
    this.updateUserForm.patchValue({
      id: this.profileRes?.userId,
    });
    this.toogleEdit();
  }

  isNotAvailableToSave(form: FormGroup) {
    if (
      !form.value.userName &&
      !form.value.email &&
      !form.value.phoneNumber &&
      !form.value.fileContent
    ) {
      return true;
    }
    return false;
  }

  saveEdit() {
    if (this.updateUserForm.valid) {
      const updateUserReqDto: UpdateUserReqDto =
        this.updateUserForm.getRawValue();
      firstValueFrom(this.userService.updateUser(updateUserReqDto)).then(() => {
        const name = this.updateUserForm.value.userName as string;
        if (name != '') {
          this.profileRes!.userName = name;
        }

        const email = this.updateUserForm.value.email as string;
        if (email != '') {
          this.profileRes!.email = email;
        }

        const phoneNumber = this.updateUserForm.value.phoneNumber as string;
        if (phoneNumber != '') {
          this.profileRes!.phoneNumber = phoneNumber;
        }

        this.updateUserForm.patchValue({
          userName: '',
          email: '',
          phoneNumber: '',
        });

        this.toogleEdit();
      });
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
          severity: 'error',
          summary: 'Rejected',
          detail: 'You have rejected',
          life: 2500,
        });
      },
    });
  }
}
