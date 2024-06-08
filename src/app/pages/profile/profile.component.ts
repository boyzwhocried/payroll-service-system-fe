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
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'profile-app',
  imports: [
    CommonModule,
    AvatarModule,
    InputTextModule,
    ButtonModule,
    ReactiveFormsModule,
    ImageModule,
    ToastModule,
    ConfirmDialogModule,
    InputMaskModule,
  ],
  standalone: true,
  templateUrl: './profile.component.html',
  providers: [ConfirmationService, MessageService],
})
export class ProfileComponent implements OnInit {
  profileRes: ProfileResDto | undefined;
  isEditable: boolean = false;
  isHover: boolean = false;
  isFormUnchanged = true;
  originalFormValues: any;

  @ViewChild('fileInput') fileInput!: ElementRef;

  updateUserForm = this.formBuilder.group({
    id: ['', [Validators.required]],
    userName: ['', [Validators.minLength(3)]],
    email: ['', [Validators.email]],
    phoneNumber: [
      '',
      [
        Validators.required,
        Validators.pattern(
          '(([+][(]?[0-9]{1,3}[)]?)|([(]?[0-9]{4}[)]?))\\s*[)]?[-\\s\\.]?[(]?[0-9]{1,3}[)]?([-s\\.]?[0-9]{3})([-\\s\\.]?[0-9]{3,4})'
        ),
      ],
    ],
    profilePictureContent: ['', [Validators.required]],
    profilePictureExtension: ['', [Validators.required]],
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
    });
  }

  generateImage(
    contentData?: string | undefined,
    extension?: string | undefined
  ): string {
    return `data:image/${extension};base64,${contentData}`;
  }

  generateNewImage(
    contentData?: string | undefined,
    extension?: string | undefined
  ): string {
    return `data:image/${extension};base64,${contentData}`;
  }

  toogleEdit() {
    this.isEditable = !this.isEditable;
    if (this.isEditable) {
      this.updateUserForm.patchValue({
        id: this.profileRes?.userId,
        phoneNumber: this.profileRes?.phoneNumber,
        ...this.profileRes,
      });
      this.originalFormValues = this.updateUserForm.getRawValue();
      firstValueFrom(this.updateUserForm.valueChanges).then(() => {
        this.checkFormUnchanged();
      });
    } else {
      this.originalFormValues = this.updateUserForm.getRawValue();
      this.updateUserForm.reset();
      firstValueFrom(this.updateUserForm.valueChanges).then(() => {
        this.checkFormUnchanged();
      });
    }
  }

  checkFormUnchanged() {
    this.isFormUnchanged =
      JSON.stringify(this.updateUserForm.getRawValue()) ===
      JSON.stringify(this.originalFormValues);
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
          profilePictureContent: base64,
          profilePictureExtension: file.type.split('/')[1],
        });
      };
      reader.readAsDataURL(file);
    }
  }

  isImageInput() {
    return (
      this.updateUserForm.value.profilePictureContent &&
      this.updateUserForm.value.profilePictureExtension
    );
  }

  saveEdit() {
    if (this.updateUserForm.valid) {
      const updateUserReqDto: UpdateUserReqDto =
        this.updateUserForm.getRawValue();
      firstValueFrom(this.userService.updateUser(updateUserReqDto)).then(
        (response) => {
          this.profileRes!.userName = updateUserReqDto.userName as string;
          this.profileRes!.email = updateUserReqDto.email as string;
          this.profileRes!.phoneNumber = updateUserReqDto.phoneNumber as string;

          this.profileRes!.profilePictureContent =
            updateUserReqDto.profilePictureContent;
          this.profileRes!.profilePictureExtension =
            updateUserReqDto.profilePictureExtension;

          this.toogleEdit();
        },
        (error) => {
          this.toogleEdit();
        }
      );
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
