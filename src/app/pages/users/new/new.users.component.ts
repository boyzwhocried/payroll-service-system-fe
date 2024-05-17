import { Component, OnInit } from "@angular/core";
import { NonNullableFormBuilder, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';

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
  ]
})
export class UserNew implements OnInit {
  roles: any[] | undefined;
  roleid: string | undefined;

  userReqDtoFg = this.fb.group({
    username: ['', [Validators.required]],
    phoneNo: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    roleId: ['', [Validators.required]],
    profileContent: [''],
    profileExtension: [''],
    companyName: ['', [Validators.required]],
    payrollDate: ['', [Validators.required]],
    companyLogoContent: [''],
    companyLogoExtension: [''],
  })
  constructor(
    private fb: NonNullableFormBuilder
  ) { }

  showCompanyInput() {
    if (this.roleid == '1') {
      return true
    } else {
      return false
    }
  }

  ngOnInit(): void {
    this.roles = [
      { name: 'Payroll Service', value: 0 },
      { name: 'Client', value: 1 }
    ];
  }
}
