import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { CalendarModule } from "primeng/calendar";
import { CardModule } from 'primeng/card';
import { BadgeModule } from 'primeng/badge';
import { AuthService } from "../../services/auth/auth.service";
import { RouterModule } from "@angular/router";
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from "primeng/toast";
import { MessageService } from "primeng/api";
import { PayrollsResDto } from "../../dto/payrolls/payrolls.res.dto";
import { PayrollService } from "../../services/payroll/payroll.service";

@Component({
  selector: 'app-schedules',
  standalone: true,
  templateUrl: './schedules.component.html',
  styleUrl: './schedules.component.css',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CalendarModule,
    ReactiveFormsModule,
    CardModule,
    BadgeModule,
    RouterModule,
    DialogModule,
    InputTextModule,
    ToastModule
  ],
  providers: [MessageService],
})
export class Schedules implements OnInit {
  roleCode: boolean = true
  status: string = 'Pending'
  dataLogin = this.authService.getLoginData()
  visible: boolean = false;
  schedules: PayrollsResDto[] = [
    {
      clientAssignmentId: 'asd12',
      clientName: 'PT Sejahtera',
      scheduleStatus: "Pending Schedule",
      payrollDate: '2024-05-20'
    },
    {
      clientAssignmentId: 'asasd12d12',
      clientName: 'PT Rebahan Maju',
      scheduleStatus: 'Completed',
      payrollDate: '2024-05-20'
    },
    {
      clientAssignmentId: 'as1231asdd12',
      clientName: 'PT Hore Selalu',
      scheduleStatus: "Pending Client's Document",
      payrollDate: '2024-05-20'
    },
    {
      clientAssignmentId: 'as1231d12',
      clientName: 'PT Haha Hihi',
      scheduleStatus: "Pending Client's Document",
      payrollDate: '2024-05-20'
    },
    {
      clientAssignmentId: 'asd1231212',
      clientName: 'PT Aurora',
      scheduleStatus: "Pending Schedule",
      payrollDate: '2024-05-20'
    },
    {
      clientAssignmentId: 'as123d12',
      clientName: 'PT Damedame',
      scheduleStatus: "Pending Client's Document",
      payrollDate: '2024-05-20'
    },
    {
      clientAssignmentId: 'asd11232',
      clientName: 'PT Ooyama Taesan',
      scheduleStatus: "Pending Feedback",
      payrollDate: '2024-05-20'
    },
  ]

  rescheduleReqDtoFg = this.fb.group({
    clientAssignmentId: ['', Validators.required],
    payrollDate: ['', [Validators.required]]
  })

  constructor(
    private authService: AuthService,
    private payrollService: PayrollService,
    private fb: NonNullableFormBuilder,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.init
  }

  init() {
    this.payrollService.getAllClients().subscribe(res => {
      this.schedules = res
    })
  }

  get Role() {
    // return this.dataLogin?.roleCode == RoleType.RL002
    return true
  }

  showDialog(schedule: PayrollsResDto) {
    this.rescheduleReqDtoFg.reset()
    this.visible = true;
    this.rescheduleReqDtoFg.patchValue(schedule)
  }

  statusColor(i: number): string {
    if (this.schedules.at(i)?.scheduleStatus) {
      return 'orange'
    } else {
      return 'green'
    }
  }

  isPendingSchedule(i: number) {
    if (this.schedules.at(i)?.scheduleStatus == 'Pending Schedule') {
      return true
    }
    return false
  }

  isCompleted(i: number) {
    if (this.schedules.at(i)?.scheduleStatus == 'Completed') {
      return true
    }
    return false
  }

  onSubmit() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: `Payroll Date is updated` });
    console.log(this.messageService)
  }
}
