import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { DocumentsReqDto } from '../../../dto/document/documents.req.dto';
import { PayrollService } from '../../../services/payroll.service';
import { DocumentReqDto } from '../../../dto/document/document.req.dto';
import { firstValueFrom } from 'rxjs';


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
  scheduleId = this.route.snapshot.queryParamMap.get('id') as string
  payrollDate = this.route.snapshot.queryParamMap.get('payrollDate')
  maxDate = this.setMaxDate(this.payrollDate)
  documents: DocumentsReqDto[] = []

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

  scheduleForm = this.fb.group({
    scheduleId: [this.scheduleId, [Validators.required]],
    documentsReqDto: this.fb.array(this.documents)
  })

  constructor(
    private route: ActivatedRoute,
    private fb : NonNullableFormBuilder,
    private location: Location,
    private payrollService: PayrollService
  ) {}

  ngOnInit(): void {
    console.log(this.payrollDate)
    console.log(this.scheduleId)
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
  console.log(dateString)

  const day = selectedDate.getUTCDate();
  const month = selectedDate.getUTCMonth() + 1; // Bulan dimulai dari 0
  const year = selectedDate.getUTCFullYear();

  // Tambahkan padding 0 jika hari atau bulan kurang dari 10
  const formattedDay = day < 10 ? `0${day}` : day;
  const formattedMonth = month < 10 ? `0${month}` : month;
  console.log(event)
  console.log(event.value)
  console.log(selectedDate)
  console.log(selectedDate.toISOString())

  const d = dateString.substring(0, dateString.length - 5);
  this.documentsReqDto.at(i)?.patchValue({documentDeadline: d})
}

  onBack() {
    this.location.back()
  }

  onSubmit() {
    if (this.scheduleForm.valid) {
      const documentReqDto : DocumentReqDto = this.scheduleForm.getRawValue()
      firstValueFrom(this.payrollService.addPayrollSchedule(documentReqDto)).then((res) => {
        console.log(res)
        this.location.back()
      })
    }
  }
}
