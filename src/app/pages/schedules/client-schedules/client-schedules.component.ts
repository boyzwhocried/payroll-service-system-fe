import { CommonModule, Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { CalendarModule } from "primeng/calendar";
import { CardModule } from 'primeng/card';
import { BadgeModule } from 'primeng/badge';
import { ActivatedRoute, RouterModule } from "@angular/router";
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from "primeng/toast";
import { MessageService } from "primeng/api";
import { TableModule } from 'primeng/table';
import { PayrollService } from "../../../services/payroll.service";
import { ScheduleResDto } from "../../../dto/schedule/schedule.res.dto";
import { ScheduleStatusType } from "../../../constants/schedule-request-types.constant";
import { firstValueFrom } from "rxjs";

@Component({
  selector: 'client-schedules',
  standalone: true,
  templateUrl: './client-schedules.component.html',
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
    ToastModule,
    TableModule,
    ButtonModule
  ],
  providers: [MessageService],
})
export class ClientSchedules implements OnInit {
  clientsSchedule : ScheduleResDto[] = []
  cols! : any[];

  constructor(
    private fb: NonNullableFormBuilder,
    private location : Location,
    private activeRoute: ActivatedRoute,
    private payrollService: PayrollService
  ){}
  ngOnInit(): void {
    this.init()
  }
  init() {
    this.cols = [
      {field:'payrollDate', header: 'Payroll Date'},
      {field: 'action', header: 'Action'}
    ]
    firstValueFrom(this.activeRoute.params).then(param  =>{
      firstValueFrom(this.payrollService.getSchedulesByClientId(param['id'])).then(res => {
        this.clientsSchedule = res
      })
    })
  }

  isPendingSchedule(i:number) {
    if (this.clientsSchedule.at(i)?.scheduleStatusCode == ScheduleStatusType.PENDING_SCHEDULE) {
      return true
    }
    return false
  }

  onBack() {
    this.location.back()
  }

  formatDate(payrollDate : string): string {
    const date = new Date(payrollDate)
    const day = String(date.getUTCDate()).padStart(2, '0')
    const month = String(date.getUTCMonth() + 1).padStart(2, '0')
    const year = date.getUTCFullYear()
    return `${day}/${month}/${year}`
  }
}
