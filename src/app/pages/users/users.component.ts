import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { MessageService, SelectItem } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';
import { Validators, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserResDto } from '../../dto/user/user.res.dto';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { UserService } from '../../services/user/user.service';
import { ImageResDto } from '../../dto/file/image.res.dto';
import { environment } from '../../../env/environment.prod';
import { UserReqDto } from '../../dto/user/user.req.dto';
import { RoleService } from '../../services/role/role.service';
import { RoleResDto } from '../../dto/role/role.res.dto';



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
  ],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent {

  @ViewChild('fileInput') fileInput!: ElementRef;

  isEditing = false;

  isHovered = false;

  userForm = this.formBuilder.group({
    id: ['', [Validators.required]],
    userName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: [''],
    roleId: ['', [Validators.required]],
    fileContent: [''],
    fileExtension: [''],
  });

  users: UserResDto[] = []

  imageUrl: ImageResDto | undefined = undefined

  clonedUsers: { [s: string]: UserResDto } = {};

  roles!: SelectItem[];

  constructor(
    private formBuilder: NonNullableFormBuilder,
    private userService: UserService,
    private roleService: RoleService,
  ) {
    const users = this.userService.getAll().subscribe(response => { this.users = response })
    this.roleService.getAll().subscribe((response: RoleResDto[]) => {
      this.roles = response.map(role => ({
        label: role.roleName,
        value: role.id
      }));
    });
  }

  generateImage(contentData?: string | undefined, extension?: string | undefined): string {

    return `data:image/${extension};base64,${contentData}`;
  }

  getImage(imageId: string) {
    return `${environment.backEndBaseUrl}:${environment.port}/files/${imageId}`
  }

  onRowEditInit(user: UserResDto) {
    const role = this.roles.find(r => r.label === user.roleName);
    this.clonedUsers[user.id as string] = { ...user };
    this.isEditing = true;
    this.userForm.patchValue({
      ...user,
      roleId: role?.value
    });
  }

  onRowEditSave() {
    if (this.userForm.valid) {
      const userReqDto: UserReqDto = this.userForm.getRawValue();
      this.userService.editUser(userReqDto).subscribe({
        next: (response) => {
          // this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
          this.isEditing = false;
          this.userForm.reset();
        },
        error: (error) => console.error('Login failed:', error),
        complete: () => console.log('Login request complete')
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
        this.userForm.patchValue({ fileContent: base64, fileExtension: file.type.split('/')[1] });
      };
      reader.readAsDataURL(file);
    }
  }

}
