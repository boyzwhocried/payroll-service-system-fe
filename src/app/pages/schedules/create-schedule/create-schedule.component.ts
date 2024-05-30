import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
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
    CalendarModule
  ],
  templateUrl: './create-schedule.component.html',
  styleUrl: './create-schedule.component.css'
})
export class CreateScheduleComponent implements OnInit{
  scheduleId! : string
  payrollDate : string = ''
  maxDate : Date | null = null
  documents: DocumentsReqDto[] = []
  scheduleForm! : any

  activityInit: DocumentsReqDto[] = [
    {
      activity: 'Employee Data',
      documentDeadline: ''
    },
    {
      activity: 'Attendance Data',
      documentDeadline: ''
    },
    {
      activity: 'Payroll Data',
      documentDeadline: ''
    },
  ]


  constructor(
    private route: ActivatedRoute,
    private fb : NonNullableFormBuilder,
    private location: Location,
    private documentService: DocumentService
  ) {}

  ngOnInit(): void {
    this.scheduleId = this.route.snapshot.queryParamMap.get('id') as string
    this.payrollDate = this.route.snapshot.queryParamMap.get('payrollDate') as string
    this.maxDate = this.setMaxDate(this.payrollDate)
    this.scheduleForm = this.fb.group({
      scheduleId: [this.scheduleId, [Validators.required]],
      documentsReqDto: this.fb.array(this.documents)
    })
    this.activityOnInit()
  }

  get documentsReqDto() {
    return this.scheduleForm.get('documentsReqDto') as FormArray
  }
  removeActivity(i : number) {
    this.documentsReqDto.removeAt(i)
  }

  activityOnInit() {
    this.documentsReqDto.push(this.fb.group({
      activity : [{value: this.activityInit.at(0)?.activity, disabled: true, }, [Validators.required]],
      documentDeadline: [this.activityInit.at(0)?.documentDeadline, [Validators.required]]
    }))
    this.documentsReqDto.push(this.fb.group({
      activity : [{value: this.activityInit.at(1)?.activity, disabled: true, }, [Validators.required]],
      documentDeadline: [this.activityInit.at(1)?.documentDeadline, [Validators.required]]
    }))
    this.documentsReqDto.push(this.fb.group({
      activity : [{value: this.activityInit.at(2)?.activity, disabled: true, }, [Validators.required]],
      documentDeadline: [this.activityInit.at(2)?.documentDeadline, [Validators.required]]
    }))
  }

  addActivity() {
    this.documentsReqDto.push(this.fb.group({
      activity : ['', [Validators.required]],
      documentDeadline: ['', [Validators.required]]
    }))
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

onDateSelect(event:any, i: number) {
  const selectedDate = new Date(event);
  const dateString = selectedDate.toISOString()

  const documentDeadline = dateString.substring(0, dateString.length - 5);
  this.documentsReqDto.at(i)?.patchValue({documentDeadline: documentDeadline})
}

  onBack() {
    this.location.back()
  }

  onSubmit() {
    if (this.scheduleForm.valid) {
      const documentReqDto : DocumentReqDto = this.scheduleForm.getRawValue()
      firstValueFrom(this.documentService.addPayrollSchedule(documentReqDto)).then(() => {
        this.location.back()
      })
    }
  }
}
