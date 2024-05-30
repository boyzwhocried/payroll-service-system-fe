import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { CalendarModule } from "primeng/calendar";
import { CardModule } from 'primeng/card';
import { BadgeModule } from 'primeng/badge';
import { AuthService } from "../../services/auth/auth.service";
import { RouterModule } from "@angular/router";
import { PayrollService } from "../../services/payroll.service";
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from "primeng/toast";
import { MessageService } from "primeng/api";
import { PayrollResDto } from "../../dto/payroll/payroll.res.dto";
import { RoleType } from "../../constants/roles.constant";
import { ScheduleStatusType } from "../../constants/schedule-request-types.constant";
import { firstValueFrom } from "rxjs";
import { ScheduleResDto } from "../../dto/schedule/schedule.res.dto";
import { RescheduleReqDto } from "../../dto/schedule/reschedule.req.dto";

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
  roleCode : boolean = true
  status: string = 'Pending'
  dataLogin = this.authService.getLoginData()
  visible: boolean = false;
  schedules : PayrollResDto[] = []
  clientSchedules : ScheduleResDto[] = []
  maxDate: Date | null = null

  rescheduleForm = this.fb.group({
      scheduleId: ['', Validators.required],
      newDeadline: ['', [Validators.required]]
  })

  constructor(
    private authService : AuthService,
    private payrollService : PayrollService,
    private fb : NonNullableFormBuilder,
  ) {}

  ngOnInit(): void {
    this.init()
  }

  init() {
    if (this.rolePS) {
      firstValueFrom(this.payrollService.getAllClients()).then(res => {
        this.schedules = res
      })
    }
    if (this.roleClient) {
      firstValueFrom(this.payrollService.getLoginClientSchedule()).then(res => {
        this.clientSchedules = res
      })
    }
  }

  get rolePS() {
    return this.dataLogin?.roleCode == RoleType.PS
  }
  get roleClient() {
    return this.dataLogin?.roleCode == RoleType.CLIENT
  }

  showDialog(schedule : ScheduleResDto) {
    this.rescheduleForm.reset()
    this.visible = true;
    this.maxDate = this.setMaxDate(schedule.payrollDate)
    this.rescheduleForm.patchValue({
      scheduleId : schedule.scheduleId,
    })
  }

  convertToDate(dateString : string | null) {
    if (!dateString) {
      return null
    }
    let date = new Date(dateString)
    return date
  }

  setMaxDate(dateString : string | null) {
    let maxDate = this.convertToDate(dateString)
    maxDate?.setDate(maxDate.getDate() - 2)
    return maxDate
  }

  formatDate(dateString : string | null) {
    let payrollDate = this.convertToDate(dateString)
    const day = String(payrollDate!.getUTCDate()).padStart(2, '0')
    const month = String(payrollDate!.getUTCMonth() + 1).padStart(2, '0') // Months are zero-based
    const year = payrollDate!.getUTCFullYear()

    return `${day}/${month}/${year}`
}

  isCompleted(i : number) {
    if (this.schedules.at(i)?.scheduleStatusCode == ScheduleStatusType.COMPLETED) {
      return true
    } else if (this.clientSchedules.at(i)?.scheduleStatusCode == ScheduleStatusType.COMPLETED) {
      return true
    }
    return false
  }

  isNoSchedule(i : number) {
    if (this.schedules.at(i)?.scheduleStatusCode == ScheduleStatusType.NO_SCHEDULE) {
      return true
    } else if (this.clientSchedules.at(i)?.scheduleStatusCode == ScheduleStatusType.NO_SCHEDULE) {
      return true
    }
    return false
  }

  onSubmit() {
    this.rescheduleForm.patchValue({
      newDeadline: this.formatDate(this.rescheduleForm.getRawValue().newDeadline)
    })
    const request : RescheduleReqDto = this.rescheduleForm.getRawValue()
    firstValueFrom(this.payrollService.createRescheduleRequest(request)).then(res =>{
      this.visible = false
    })
  }
}
