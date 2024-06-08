import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RoleService } from '../../../services/role/role.service';
import { RoleType } from '../../../constants/roles.constant';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { UserService } from '../../../services/user/user.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { RoleResDto } from '../../../dto/role/role.res.dto';
import { UserReqDto } from '../../../dto/user/user.req.dto';
import { CompanyReqDto } from '../../../dto/company/company.req.dto';
import { InputMaskModule } from 'primeng/inputmask';
import { firstValueFrom } from 'rxjs';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Router } from '@angular/router';
import { ButtonIconService } from '../../../services/button-icon.service';

@Component({
  selector: 'user-new',
  standalone: true,
  templateUrl: './new.users.component.html',
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    DropdownModule,
    CalendarModule,
    ReactiveFormsModule,
    FileUploadModule,
    ToastModule,
    InputMaskModule,
    ConfirmDialogModule,
  ],
  providers: [MessageService, ConfirmationService],
})
export class UserNew implements OnInit {
  roles: RoleResDto[] = [];
  isClient: boolean = false;
  userForm: FormGroup;
  fileUploadProfile: any
  fileUploadCompany: any
  createUserLoading = false

  constructor(
    private formBuilder: FormBuilder,
    private roleService: RoleService,
    private userService: UserService,
    private router: Router,
    public buttonIconService: ButtonIconService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.userForm = this.formBuilder.group({
      username: ['', Validators.required],
      phoneNo: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '(([+][(]?[0-9]{1,3}[)]?)|([(]?[0-9]{4}[)]?))\\s*[)]?[-\\s\\.]?[(]?[0-9]{1,3}[)]?([-s\\.]?[0-9]{3})([-\\s\\.]?[0-9]{3,4})'
          ),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      roleId: ['', Validators.required],
      profileContent: [''],
      profileExtension: [''],
      companyName: ['', Validators.required],
      payrollDate: ['', Validators.required],
      companyLogoContent: [''],
      companyLogoExtension: [''],
    });
  }

  ngOnInit(): void {
    this.loadRoles();
  }

  get profileContent() {
    return this.userForm.get('profileContent')?.value != "";
  }

  get companyLogoContent() {
    return this.userForm.get('companyLogoContent')?.value != "";
  }

  loadRoles(): void {
    firstValueFrom(this.roleService.getAll()).then((response) => {
      this.roles = response;
    });
  }

  changeRoleOption(): void {
    this.isClient = this.roles.some(
      (role) =>
        role.id === this.userForm.value.roleId &&
        role.roleCode === RoleType.CLIENT
    );

    const companyNameControl = this.userForm.get('companyName');
    const payrollDateControl = this.userForm.get('payrollDate');

    if (this.isClient) {
      companyNameControl?.setValidators([Validators.required]);
      payrollDateControl?.setValidators([Validators.required]);
    } else {
      companyNameControl?.clearValidators();
      payrollDateControl?.clearValidators();
    }

    companyNameControl?.updateValueAndValidity();
    payrollDateControl?.updateValueAndValidity();
  }

  onProfileSelect(event: any, isCompanyLogo: boolean, fileUpload: any): void {
    const file = event.files && event.files.length > 0 ? event.files[0] : null;
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      const extension = file.name.split('.').pop();

      if (isCompanyLogo) {
        this.userForm.patchValue({
          companyLogoContent: base64,
          companyLogoExtension: extension,
        });
        this.fileUploadCompany = fileUpload
      } else {
        this.userForm.patchValue({
          profileContent: base64,
          profileExtension: extension,
        });
        this.fileUploadProfile = fileUpload
      }
    };
    reader.readAsDataURL(file);
  }

  formatPayrollDate(date: string): string {
    const parsedDate = new Date(date);
    if (!isNaN(parsedDate.getTime())) {

      console.log(String(parsedDate.getDate()));
      return String(parsedDate.getDate());
    }
    console.log('no shit');
    return '';
  }

  handlePayrollDateChanges(): void {
    const date = this.userForm.get('payrollDate')?.value
    if (date) {
      console.log(date);
      const formattedDate = this.formatPayrollDate(date);
      this.userForm.patchValue({ payrollDate: formattedDate }, { emitEvent: false });
    }
  }

  removeProfilePicture() {
    const profileContent = this.userForm.get('profileContent');
    const profileExtension = this.userForm.get('profileExtension');
    profileContent?.patchValue('');
    profileExtension?.patchValue('');

    this.fileUploadProfile?.clear()
  }

  removeCompanyLogo() {
    const companyLogoContent = this.userForm.get('companyLogoContent');
    const companyLogoExtension = this.userForm.get('companyLogoExtension');
    companyLogoContent?.patchValue('');
    companyLogoExtension?.patchValue('');

    this.fileUploadCompany?.clear()
  }

  onBack() {
    this.router.navigateByUrl(`/users`)
  }

  createUser(): void {
    if (this.userForm.valid) {
      this.handlePayrollDateChanges();

      const formattedPayrollDate = this.userForm.value.payrollDate as string;

      const company: CompanyReqDto = {
        companyName: this.userForm.value.companyName as string,
        fileContent: this.userForm.value.companyLogoContent as string,
        fileExtension: this.userForm.value.companyLogoExtension as string,
        payrollDate: formattedPayrollDate,
      };

      const user: UserReqDto = {
        userName: this.userForm.value.username as string,
        phoneNumber: this.userForm.value.phoneNo as string,
        email: this.userForm.value.email as string,
        roleId: this.userForm.value.roleId as string,
        fileContent: this.userForm.value.profileContent as string,
        fileExtension: this.userForm.value.profileExtension as string,
        companyReq: company,
      };

      this.createUserLoading = true
      this.userService.addUser(user).subscribe(
        (response) => {
          this.userForm.reset();
          this.fileUploadProfile?.clear()
          this.fileUploadCompany?.clear()
          this.createUserLoading = false
        },
        (error) => {
          this.userForm.reset();
          this.createUserLoading = false
        }
      );
    }
  }

  confirm() {
    this.confirmationService.confirm({
      header: 'Are you sure?',
      message: 'Please confirm to proceed.',
      accept: () => {
        this.createUser();
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
