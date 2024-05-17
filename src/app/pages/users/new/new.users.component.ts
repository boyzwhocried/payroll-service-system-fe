import { Component, OnInit } from "@angular/core";
import { NonNullableFormBuilder, Validators } from "@angular/forms";

@Component({
  selector: 'user-new',
  templateUrl: './new.users.component.html'
})
export class UserNew implements OnInit{
  roles: any[] | undefined;
  roleid: string|undefined;

  userReqDtoFg = this.fb.group ({
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
    private fb : NonNullableFormBuilder
  ) {}

  showCompanyInput() {
    if (this.roleid == '1') {
      return true
    }  else {
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
