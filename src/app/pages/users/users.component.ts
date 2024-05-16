import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UsersResDto } from '../../models/dto/users/users.res.dto';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { MessageService, SelectItem } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';
import { Validators, NonNullableFormBuilder } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { RoleType } from '../../constants/role.const';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ToastModule,
    TagModule,
    DropdownModule,
    ButtonModule,
    InputTextModule,
    RippleModule,
    FormsModule,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
  providers: [MessageService]
})

export class UsersComponent {

  userForm = this.formBuilder.group({
    id: ['', [Validators.required]],
    userName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: [''],
    roleName: ['', [Validators.required]],
  });

  users: UsersResDto[] = [
    {
      id: "3b9f47cf-2748-4632-b384-eb0c62b74f21",
      userName: "Lisa",
      email: "lisa@gmail.com",
      phoneNumber: "03939",
      roleName: "Super Admin"
    },
    {
      id: "df035893-2413-4bf6-9dfe-0e1dd4855169",
      userName: "Budi",
      email: "budi@gmail.com",
      phoneNumber: "03938",
      roleName: "Payroll Service"
    },
    {
      id: "b247e0bf-669a-4b54-8c9a-42a9523e326d",
      userName: "Bambang",
      email: "bambang@gmail.com",
      phoneNumber: "03937",
      roleName: "Client"
    },
    {
      id: "18a30c17-24f6-4f2b-942d-7b7dcd039559",
      userName: "Dule",
      email: "dule@gmail.com",
      phoneNumber: "03936",
      roleName: "Client"
    },
  ]

  clonedUsers: { [s: string]: UsersResDto } = {};

  roles!: SelectItem[];

  constructor(
    private messageService: MessageService,
    private formBuilder: NonNullableFormBuilder,
    private authService: AuthService,
  ) { }

  ngOnInit() {


    this.roles = [
      { label: RoleType.RL001, value: RoleType.RL001 },
      { label: RoleType.RL002, value: RoleType.RL002 },
      { label: RoleType.RL003, value: RoleType.RL003 }
    ];
  }

  onRowEditInit(user: UsersResDto) {
    this.clonedUsers[user.id as string] = { ...user };
  }

  onRowEditSave(user: UsersResDto) {
    // if (user.price > 0) {
    //     delete this.clonedUsers[user.id as string];
    // const userReqDto: UserReqDto = this.userForm.getRawValue()
    this.messageService.add({ severity: 'success', summary: 'Success', detail: `User is updated` });
    // } else {
    //     this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Price' });
    // }
  }

  onRowEditCancel(user: UsersResDto, index: number) {
    this.users[index] = this.clonedUsers[user.id as string];
    delete this.clonedUsers[user.id as string];
  }
}
