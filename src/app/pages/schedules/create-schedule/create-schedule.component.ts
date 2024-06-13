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
import { DocumentsReqDto } from '../../../dto/document/documents.req.dto';
import { DocumentReqDto } from '../../../dto/document/document.req.dto';
import { firstValueFrom } from 'rxjs';
import { DocumentService } from '../../../services/document.service';

@Component({
  selector: 'app-create-schedule',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ToastModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    CalendarModule,
  ],
  templateUrl: './create-schedule.component.html',
  styleUrl: './create-schedule.component.css',
})
export class CreateScheduleComponent implements OnInit {
  scheduleId!: string;
  payrollDate: string = '';
  maxDate: Date | null = null;
  minDate: Date | null = null;
  documents: DocumentsReqDto[] = [];
  scheduleForm!: any;

  activityInit: DocumentsReqDto[] = [
    {
      activity: 'Employee Data',
      documentDeadline: '',
    },
    {
      activity: 'Attendance Data',
      documentDeadline: '',
    },
    {
      activity: 'Payroll Data',
      documentDeadline: '',
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private fb: NonNullableFormBuilder,
    private location: Location,
    private documentService: DocumentService
  ) {}

  ngOnInit(): void {
    this.scheduleId = this.route.snapshot.queryParamMap.get('id') as string;
    this.payrollDate = this.route.snapshot.queryParamMap.get(
      'payrollDate'
    ) as string;
    this.minDate = this.setMinDate();
    this.maxDate = this.setMaxDate(this.payrollDate);
    this.scheduleForm = this.fb.group({
      scheduleId: [this.scheduleId, [Validators.required]],
      documentsReqDto: this.fb.array(this.documents),
    });
    this.activityOnInit();
  }

  get documentsReqDto() {
    return this.scheduleForm.get('documentsReqDto') as FormArray;
  }
  removeActivity(i: number) {
    this.documentsReqDto.removeAt(i);
  }

  activityOnInit() {
    this.documentsReqDto.push(
      this.fb.group({
        activity: [
          { value: this.activityInit.at(0)?.activity, disabled: true },
          [Validators.required],
        ],
        documentDeadline: [
          this.activityInit.at(0)?.documentDeadline,
          [Validators.required],
        ],
      })
    );
    this.documentsReqDto.push(
      this.fb.group({
        activity: [
          { value: this.activityInit.at(1)?.activity, disabled: true },
          [Validators.required],
        ],
        documentDeadline: [
          this.activityInit.at(1)?.documentDeadline,
          [Validators.required],
        ],
      })
    );
    this.documentsReqDto.push(
      this.fb.group({
        activity: [
          { value: this.activityInit.at(2)?.activity, disabled: true },
          [Validators.required],
        ],
        documentDeadline: [
          this.activityInit.at(2)?.documentDeadline,
          [Validators.required],
        ],
      })
    );
  }

  addActivity() {
    this.documentsReqDto.push(
      this.fb.group({
        activity: ['', [Validators.required]],
        documentDeadline: ['', [Validators.required]],
      })
    );
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
    const currentMonth = currentDate.getMonth() + 1;
    const dateString = `01/${currentMonth}/2024`;

    let minDate = this.convertToDate(dateString);
    minDate?.setDate(minDate.getDate());
    return minDate;
  }

  setMaxDate(dateString: string | null) {
    let maxDate = this.convertToDate(dateString);
    maxDate?.setDate(maxDate.getDate() - 2);
    return maxDate;
  }

  onDateSelect(event: any, i: number) {
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

    this.documentsReqDto
      .at(i)
      ?.patchValue({ documentDeadline: documentDeadline });
  }

  onBack() {
    this.location.back();
  }

  onSubmit() {
    if (this.scheduleForm.valid) {
      const documentReqDto: DocumentReqDto = this.scheduleForm.getRawValue();
      firstValueFrom(
        this.documentService.addPayrollSchedule(documentReqDto)
      ).then(() => {
        this.location.back();
      });
    }
  }
}
