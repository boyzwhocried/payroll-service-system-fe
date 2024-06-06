import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { firstValueFrom } from 'rxjs';
import { OldDocumentResDto } from '../../../dto/document/old-document.req.dto';
import { UpdateDocumentScheduleReqDto } from '../../../dto/document/update-document-schedule.req.dto';
import { DocumentService } from '../../../services/document.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-reschedule',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ToastModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    CalendarModule,
    ConfirmDialogModule,
  ],
  templateUrl: './reschedule.component.html',
  styleUrl: './reschedule.component.css',
  providers: [ConfirmationService, MessageService],
})
export class RescheduleComponent implements OnInit {
  scheduleId!: string;
  payrollDate: string = '';
  maxDate: Date | null = null;
  minDate: Date | null = null;
  reschedule: OldDocumentResDto[] = [];
  req: UpdateDocumentScheduleReqDto[] = [];

  rescheduleForm = this.fb.group({
    rescheduleReqDto: this.fb.array(this.req),
  });

  constructor(
    private route: ActivatedRoute,
    private fb: NonNullableFormBuilder,
    private location: Location,
    private documentService: DocumentService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.scheduleId = this.route.snapshot.queryParamMap.get('id') as string;
    firstValueFrom(this.documentService.getScheduleById(this.scheduleId)).then(
      (res) => {
        this.reschedule = res;
        this.activityOnInit();
      }
    );
    this.payrollDate = this.route.snapshot.queryParamMap.get(
      'payrollDate'
    ) as string;
    this.minDate = this.setMinDate();
    this.maxDate = this.setMaxDate(this.payrollDate);
    this.clickInit();
  }

  activityOnInit() {
    for (let i = 0; i < this.reschedule.length; i++) {
      const documentDeadline = this.reschedule.at(i)!.documentDeadline
        ? new Date(this.reschedule.at(i)!.documentDeadline)
        : null;
      this.rescheduleReqDto.push(
        this.fb.group({
          documentId: [
            { value: this.reschedule.at(i)?.documentId, disabled: true },
            [Validators.required],
          ],
          activity: [
            { value: this.reschedule.at(i)?.activity, disabled: true },
            [Validators.required],
          ],
          documentDeadline: [documentDeadline, [Validators.required]],
        })
      );
    }
  }

  clickInit() {
    for (let i = 0; i < this.rescheduleReqDto.length; i++) {
      var documentDeadline = this.rescheduleReqDto
        .at(i)
        .get('documentDeadline')?.value;
      this.formatDateForSubmission(documentDeadline);
    }
  }

  get rescheduleReqDto() {
    return this.rescheduleForm.get('rescheduleReqDto') as FormArray;
  }

  convertToDate(dateString: string | null) {
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

  convertToUTC(dateString: string): string {
    const [day, month, year] = dateString
      .split('/')
      .map((part) => parseInt(part, 10));
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.toISOString();
  }

  formatDateForSubmission(dateString: string | null): string | null {
    if (!dateString) {
      return null;
    }
    const datePattern = /^\d{2}\/\d{2}\/\d{4}$/;

    if (typeof dateString === 'string' && datePattern.test(dateString)) {
      const date = this.convertToUTC(dateString);
      return date;
    }

    if (typeof dateString === 'string' && dateString.length > 11) {
      const date = new Date(dateString);
      return date.toISOString();
    }

    return dateString;
  }

  onBack() {
    this.location.back();
  }

  confirmReschedule() {
    if (this.rescheduleForm.valid) {
      const request: UpdateDocumentScheduleReqDto[] =
        this.rescheduleForm.getRawValue().rescheduleReqDto;
      for (let i = 0; i < request.length; i++) {
        const formattedDate = this.formatDateForSubmission(
          request[i].documentDeadline
        );
        request[i].documentDeadline = formattedDate as string;
        delete request[i].activity;
      }

      firstValueFrom(this.documentService.updateSchedule(request)).then(() => {
        this.location.back();
      });
    }
  }

  confirm() {
    this.confirmationService.confirm({
      header: 'Are you sure?',
      message: 'Please confirm to proceed.',
      accept: () => {
        this.confirmReschedule();
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
