import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { MessageService } from 'primeng/api';
import { PayrollResDto } from '../../dto/payroll/payroll.res.dto';
import { RoleType } from '../../constants/roles.constant';
import { ScheduleStatusType } from '../../constants/schedule-request-types.constant';
import { firstValueFrom } from 'rxjs';
import { ScheduleResDto } from '../../dto/schedule/schedule.res.dto';
import { RescheduleReqDto } from '../../dto/schedule/reschedule.req.dto';
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
    ImageModule,
    SkeletonModule,
  ],
  providers: [MessageService],
})
export class SchedulesComponent implements OnInit {
  roleCode: boolean = true;
  status: string = 'Pending';
  dataLogin = this.authService.getLoginData();
  visible: boolean = false;
  schedules: PayrollResDto[] = [];
  clientSchedules: ScheduleResDto[] = [];
  maxDate: Date | null = null;
  isLoading = true

  rescheduleForm = this.fb.group({
    scheduleId: ['', Validators.required],
    newDeadline: ['', [Validators.required]],
  });

  constructor(
    private authService: AuthService,
    private payrollService: PayrollService,
    private fb: NonNullableFormBuilder
  ) { }

  ngOnInit(): void {
    this.init();
  }

  private async init() {
    if (this.rolePS) {
      try {
        this.isLoading = true;
        this.schedules = await firstValueFrom(this.payrollService.getAllClients());
      } finally {
        this.isLoading = false;
      }

    }
    if (this.roleClient) {
      try {
        this.isLoading = true;
        this.clientSchedules = await firstValueFrom(this.payrollService.getLoginClientSchedule());
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
    this.maxDate = this.setMaxDate(schedule.payrollDate);
    this.rescheduleForm.patchValue({
      scheduleId: schedule.scheduleId,
    });
  }

  private convertToDate(dateString: string | null): Date | null {
    if (!dateString) {
      return null;
    }
    const [day, month, year] = dateString.split('/').map(part => parseInt(part, 10));
    return new Date(year, month - 1, day);
  }

  private setMaxDate(dateString: string | null): Date | null {
    const maxDate = this.convertToDate(dateString);
    maxDate?.setDate(maxDate.getDate() - 2);
    return maxDate;
  }

  private formatDate(dateString: string | null): string {
    const payrollDate = this.convertToDate(dateString);
    if (!payrollDate) {
      return '';
    }
    const day = String(payrollDate.getUTCDate()).padStart(2, '0');
    const month = String(payrollDate.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = payrollDate.getUTCFullYear();
    return `${day}/${month}/${year}`;
  }

  isCompleted(i: number): boolean {
    return this.schedules[i]?.scheduleStatusCode === ScheduleStatusType.COMPLETED ||
      this.clientSchedules[i]?.scheduleStatusCode === ScheduleStatusType.COMPLETED;
  }

  isNoSchedule(i: number): boolean {
    return this.schedules[i]?.scheduleStatusCode === ScheduleStatusType.NO_SCHEDULE ||
      this.clientSchedules[i]?.scheduleStatusCode === ScheduleStatusType.NO_SCHEDULE;
  }

  onSubmit() {
    const newDeadline = this.formatDate(this.rescheduleForm.getRawValue().newDeadline);
    this.rescheduleForm.patchValue({ newDeadline });
    const request: RescheduleReqDto = this.rescheduleForm.getRawValue();
    firstValueFrom(this.payrollService.createRescheduleRequest(request)).then(() => {
      this.visible = false;
    });
  }
}
