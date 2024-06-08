import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { UserResDto } from '../../dto/user/user.res.dto';
import { CheckboxModule } from 'primeng/checkbox';
import { firstValueFrom } from 'rxjs';
import { SkeletonModule } from 'primeng/skeleton';
import { ImageModule } from 'primeng/image';
import { UpdateUserReqDto } from '../../dto/user/update-user.req.dto';
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
    CheckboxModule,
    SkeletonModule,
    ImageModule,
  ],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;

  isEditing = false;
  isHovered = false;
  users: UserResDto[] = [];
  clonedUsers: { [s: string]: UserResDto } = {};
  roles?: SelectItem[];
  originalFormValues: any;
  isFormUnchanged = true;
  showFilterRow = false;
  usersSkeleton: string[] = [];
  isLoading = true

  userForm = this.formBuilder.group({
    id: ['', [Validators.required]],
    userName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: [
      '',
      [
        Validators.required,
        Validators.pattern(
          '(([+][(]?[0-9]{1,3}[)]?)|([(]?[0-9]{4}[)]?))\\s*[)]?[-\\s\\.]?[(]?[0-9]{1,3}[)]?([-s\\.]?[0-9]{3})([-\\s\\.]?[0-9]{3,4})'
        ),
      ],
    ],
    profilePictureContent: [''],
    profilePictureExtension: [''],
  });

  constructor(
    private formBuilder: NonNullableFormBuilder,
    private userService: UserService,
    private roleService: RoleService,
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.usersSkeleton = Array.from({ length: 3 }).map((_, i) => `Item #${i}`);
    try {
      this.isLoading = true;
      await firstValueFrom(this.userService.getAll()).then((response) => {
        this.users = response;
      });
      await firstValueFrom(this.roleService.getAll()).then((response: RoleResDto[]) => {
        this.roles = response.map((role) => ({
          label: role.roleName,
          value: role.id,
        }));
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      this.isLoading = false;
    }
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
    this.clonedUsers[user.id as string] = { ...user };
    this.isEditing = true;
    this.userForm.patchValue({
      ...user,
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

  onRowEditSave(index: number) {
    this.isEditing = false;
    if (this.userForm.valid) {
      const userReqDto: UpdateUserReqDto = this.userForm.getRawValue();
      firstValueFrom(this.userService.editUser(userReqDto)).then(
        (next) => {
          this.users.at(index)!.userName = this.userForm.value
            .userName as string;
          this.users.at(index)!.email = this.userForm.value.email as string;
          this.users.at(index)!.phoneNumber = this.userForm.value
            .phoneNumber as string;
          this.users.at(index)!.profilePictureContent = this.userForm.value
            .profilePictureContent as string;
          this.users.at(index)!.profilePictureExtension = this.userForm.value
            .profilePictureExtension as string;

          this.userForm.reset();

          this.originalFormValues = this.userForm.getRawValue();
          firstValueFrom(this.userForm.valueChanges).then(() => {
            this.checkFormUnchanged();
          });
        },
        (error) => {
          this.userForm.reset();
        }
      );
    }
  }

  onRowEditCancel(user: UserResDto, index: number) {
    this.users[index] = this.clonedUsers[user.id as string];
    delete this.clonedUsers[user.id as string];
    this.userForm.reset();
    this.isEditing = false;
    this.originalFormValues = this.userForm.getRawValue();
    firstValueFrom(this.userForm.valueChanges).then(() => {
      this.checkFormUnchanged();
    });
    this.originalFormValues = this.userForm.getRawValue();
    firstValueFrom(this.userForm.valueChanges).then(() => {
      this.checkFormUnchanged();
    });
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
          profilePictureContent: base64,
          profilePictureExtension: file.type.split('/')[1],
        });
      };
      reader.readAsDataURL(file);
    }
  }
}
