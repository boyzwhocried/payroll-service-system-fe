import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { BadgeModule } from 'primeng/badge';
import { AuthService } from '../../services/auth/auth.service';
import { RouterModule } from '@angular/router';
import { PayrollService } from '../../services/payroll.service';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PayrollResDto } from '../../dto/payroll/payroll.res.dto';
import { RoleType } from '../../constants/roles.constant';
import { ScheduleStatusType } from '../../constants/schedule-request-types.constant';
import { firstValueFrom } from 'rxjs';
import { ScheduleResDto } from '../../dto/schedule/schedule.res.dto';
import { RescheduleReqDto } from '../../dto/schedule/reschedule.req.dto';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ImageModule } from 'primeng/image';
import { SkeletonModule } from 'primeng/skeleton';

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
    ToastModule,
    ConfirmPopupModule,
    ConfirmDialogModule,
    ImageModule,
    SkeletonModule,
  ],
  providers: [MessageService, ConfirmationService],
})
export class SchedulesComponent implements OnInit {
  roleCode: boolean = true;
  status: string = 'Pending';
  dataLogin = this.authService.getLoginData();
  visible: boolean = false;
  schedules: PayrollResDto[] = [];
  clientSchedules: ScheduleResDto[] = [];
  maxDate: Date | null = null;
  minDate: Date | null = null;
  isLoading = true;

  rescheduleForm = this.fb.group({
    scheduleId: ['', Validators.required],
    newDeadline: ['', [Validators.required]],
  });

  constructor(
    private authService: AuthService,
    private payrollService: PayrollService,
    private fb: NonNullableFormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.init();
  }

  private async init() {
    if (this.rolePS) {
      try {
        this.isLoading = true;
        this.schedules = await firstValueFrom(
          this.payrollService.getAllClients()
        );
      } finally {
        this.isLoading = false;
      }
    }
    if (this.roleClient) {
      try {
        this.isLoading = true;
        this.clientSchedules = await firstValueFrom(
          this.payrollService.getLoginClientSchedule()
        );
      } finally {
        this.isLoading = false;
      }
    }
  }

  get rolePS() {
    return this.dataLogin?.roleCode === RoleType.PS;
  }

  get roleClient() {
    return this.dataLogin?.roleCode === RoleType.CLIENT;
  }

  showDialog(schedule: ScheduleResDto) {
    this.rescheduleForm.reset();
    this.visible = true;
    this.minDate = this.setMinDate();
    this.maxDate = this.setMaxDate(schedule.payrollDate);
    this.rescheduleForm.patchValue({
      scheduleId: schedule.scheduleId,
    });
  }

  private convertToDate(dateString: string | null): Date | null {
    if (!dateString) {
      return null;
    }
    const parts = dateString.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    let date = new Date(year, month, day);
    return date;
  }

  setMinDate() {
    const currentDate = new Date();

    let minDate = currentDate;
    return minDate;
  }

  setMaxDate(dateString: string | null) {
    let maxDate = this.convertToDate(dateString);
    maxDate?.setDate(maxDate.getDate() - 2);
    return maxDate;
  }

  onDateSelect(event: any) {
    const selectedDate = new Date(event);

    const newDate = new Date(
      Date.UTC(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        selectedDate.getHours(),
        selectedDate.getMinutes(),
        selectedDate.getSeconds()
      )
    );
    const dateString = newDate.toISOString();

    const documentDeadline = dateString.substring(0, dateString.length - 5);

    this.rescheduleForm.patchValue({ newDeadline: documentDeadline });
  }

  isCompleted(i: number): boolean {
    return (
      this.schedules[i]?.scheduleStatusCode === ScheduleStatusType.COMPLETED ||
      this.clientSchedules[i]?.scheduleStatusCode ===
        ScheduleStatusType.COMPLETED
    );
  }

  isNoSchedule(i: number): boolean {
    return (
      this.schedules[i]?.scheduleStatusCode ===
        ScheduleStatusType.NO_SCHEDULE ||
      this.clientSchedules[i]?.scheduleStatusCode ===
        ScheduleStatusType.NO_SCHEDULE
    );
  }

  confirm(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to proceed?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.visible = false;
        this.sendReschedule();
      },
      reject: () => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Rejected',
          detail: 'You have rejected',
          life: 3000,
        });
      },
    });
  }

  sendReschedule() {
    const request: RescheduleReqDto = this.rescheduleForm.getRawValue();
    firstValueFrom(this.payrollService.createRescheduleRequest(request)).then(
      () => {
        this.visible = false;
      }
    );
  }
}
