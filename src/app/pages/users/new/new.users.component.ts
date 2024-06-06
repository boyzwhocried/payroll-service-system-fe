import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { RoleService } from "../../../services/role/role.service";
import { RoleType } from "../../../constants/roles.constant";
import { CommonModule } from "@angular/common";
import { ButtonModule } from "primeng/button";
import { CalendarModule } from "primeng/calendar";
import { DropdownModule } from "primeng/dropdown";
import { InputTextModule } from "primeng/inputtext";
import { FileUploadModule } from 'primeng/fileupload';
import { UserService } from "../../../services/user/user.service";
import { MessageService } from "primeng/api";
import { ToastModule } from "primeng/toast";
import { RoleResDto } from "../../../dto/role/role.res.dto";
import { UserReqDto } from "../../../dto/user/user.req.dto";
import { CompanyReqDto } from "../../../dto/company/company.req.dto";
import { InputMaskModule } from 'primeng/inputmask';
import { firstValueFrom } from "rxjs";

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
    InputMaskModule
  ],
  providers: [MessageService],
})
export class UserNew implements OnInit {
  roles: RoleResDto[] = [];
  isClient: boolean = false;
  userForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private roleService: RoleService,
    private userService: UserService,
  ) {
    this.userForm = this.formBuilder.group({
      username: ['', Validators.required],
      phoneNo: ['', [Validators.required, Validators.pattern('(([+][(]?[0-9]{1,3}[)]?)|([(]?[0-9]{4}[)]?))\\s*[)]?[-\\s\\.]?[(]?[0-9]{1,3}[)]?([-\s\\.]?[0-9]{3})([-\\s\\.]?[0-9]{3,4})')]],
      email: ['', [Validators.required, Validators.email]],
      roleId: ['', Validators.required],
      profileContent: [''],
      profileExtension: [''],
      companyName: ['', Validators.required],
      payrollDate: ['', Validators.required],
      companyLogoContent: [''],
      companyLogoExtension: ['']
    });
  }

  ngOnInit(): void {
    this.loadRoles();
    this.handlePayrollDateChanges();
  }

  loadRoles(): void {
    firstValueFrom(this.roleService.getAll()).then(response => {
      this.roles = response;
    });
  }

  changeRoleOption(): void {
    this.isClient = this.roles.some(role => role.id === this.userForm.value.roleId && role.roleCode === RoleType.CLIENT);

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

  onProfileSelect(event: any, isCompanyLogo: boolean): void {
    const file = event.files && event.files.length > 0 ? event.files[0] : null;
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      const extension = file.name.split('.').pop();

      if (isCompanyLogo) {
        this.userForm.patchValue({
          companyLogoContent: base64,
          companyLogoExtension: extension
        });
      } else {
        this.userForm.patchValue({
          profileContent: base64,
          profileExtension: extension
        });
      }
    };
    reader.readAsDataURL(file);
  }

  formatPayrollDate(date: string): string {
    const parsedDate = new Date(date);
    if (!isNaN(parsedDate.getTime())) {
      return String(parsedDate.getDate());
    }
    return '';
  }

  handlePayrollDateChanges(): void {
    this.userForm.get('payrollDate')?.valueChanges.subscribe(date => {
      if (date) {
        const formattedDate = this.formatPayrollDate(date);
        this.userForm.patchValue({ payrollDate: formattedDate }, { emitEvent: false });
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
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
        companyReq: company
      };

      this.userService.addUser(user).subscribe(
        response => {
          this.userForm.reset();
        },
        error => {
          // Handle error
        }
      );
    }
  }
}
