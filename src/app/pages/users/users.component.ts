import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { SelectItem } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';
import {
  Validators,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { UserService } from '../../services/user/user.service';
import { environment } from '../../../env/environment.prod';
import { UserReqDto } from '../../dto/user/user.req.dto';
import { RoleService } from '../../services/role/role.service';
import { RoleResDto } from '../../dto/role/role.res.dto';
import { UserResDto } from '../../dto/user/user.res.dto';
import { CheckboxModule } from 'primeng/checkbox';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    TagModule,
    DropdownModule,
    ButtonModule,
    InputTextModule,
    RippleModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    AvatarModule,
    AvatarGroupModule,
    CheckboxModule,
  ],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;

  isEditing = false;
  isHovered = false;
  users: UserResDto[] = [];
  clonedUsers: { [s: string]: UserResDto } = {};
  roles?: SelectItem[];
  originalFormValues: any;
  isFormUnchanged = true;
  showFilterRow = false;

  userForm = this.formBuilder.group({
    id: ['', [Validators.required]],
    userName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: [''],
    roleId: ['', [Validators.required]],
    fileContent: [''],
    fileExtension: [''],
  });

  constructor(
    private formBuilder: NonNullableFormBuilder,
    private userService: UserService,
    private roleService: RoleService
  ) {
    firstValueFrom(this.userService.getAll()).then((response) => {
      this.users = response;
    });
    firstValueFrom(this.roleService.getAll()).then((response: RoleResDto[]) => {
      this.roles = response.map((role) => ({
        label: role.roleName,
        value: role.id,
      }));
    });
  }

  generateImage(
    contentData?: string | undefined,
    extension?: string | undefined
  ): string {
    return `data:image/${extension};base64,${contentData}`;
  }

  getImage(imageId: string) {
    return `${environment.backEndBaseUrl}:${environment.port}/files/${imageId}`;
  }

  onRowEditInit(user: UserResDto) {
    const role = this.roles?.find((r) => r.label === user.roleName);
    this.clonedUsers[user.id as string] = { ...user };
    this.isEditing = true;
    this.userForm.patchValue({
      ...user,
      roleId: role?.value,
    });
    this.originalFormValues = this.userForm.getRawValue();
    firstValueFrom(this.userForm.valueChanges).then(() => {
      this.checkFormUnchanged();
    });
  }

  checkFormUnchanged() {
    this.isFormUnchanged =
      JSON.stringify(this.userForm.getRawValue()) ===
      JSON.stringify(this.originalFormValues);
  }

  onRowEditSave() {
    this.isEditing = false;
    if (this.userForm.valid) {
      const userReqDto: UserReqDto = this.userForm.getRawValue();
      this.userService.editUser(userReqDto).subscribe({
        next: (response) => {
          // this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
          this.userForm.reset();
        },
        error: (error) => console.error('Update failed:', error),
        complete: () => {
          console.log('Update user complete');
          this.userForm.reset();
        },
      });
    } else {
      // this.messageService.add({ severity: 'warning', summary: 'Failed', detail: `Form is not valid` });
    }
  }

  onRowEditCancel(user: UserResDto, index: number) {
    this.users[index] = this.clonedUsers[user.id as string];
    delete this.clonedUsers[user.id as string];
    this.userForm.reset();
    this.isEditing = false;
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
        this.userForm.patchValue({
          fileContent: base64,
          fileExtension: file.type.split('/')[1],
        });
      };
      reader.readAsDataURL(file);
    }
  }
}
