import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { firstValueFrom } from 'rxjs';
import { OldDocumentResDto } from '../../../dto/document/old-document.req.dto';
import { UpdateDocumentScheduleReqDto } from '../../../dto/document/update-document-schedule.req.dto';
import { DocumentService } from '../../../services/document.service';
import { BackButtonComponent } from "../../../components/back-button/back-button.component";
import { SkeletonModule } from 'primeng/skeleton';


@Component({
  selector: 'app-reschedule',
  standalone: true,
  templateUrl: './reschedule.component.html',
  styleUrl: './reschedule.component.css',
  imports: [
    CommonModule,
    TableModule,
    ToastModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    CalendarModule,
    BackButtonComponent,
    SkeletonModule,
  ]
})
export class RescheduleComponent implements OnInit {
  scheduleId!: string
  payrollDate: string = ''
  maxDate: Date | null = null
  reschedule: OldDocumentResDto[] = []
  req: UpdateDocumentScheduleReqDto[] = []
  isLoading = true

  rescheduleForm = this.fb.group({
    rescheduleReqDto: this.fb.array(this.req)
  })

  constructor(
    private route: ActivatedRoute,
    private fb: NonNullableFormBuilder,
    private location: Location,
    private documentService: DocumentService
  ) { }

  async ngOnInit(): Promise<void> {
    this.scheduleId = this.route.snapshot.queryParamMap.get('id') as string

    try {
      this.isLoading = true
      await firstValueFrom(this.documentService.getScheduleById(this.scheduleId)).then((res) => {
        this.reschedule = res
        this.activityOnInit()
      })
    } catch (error) {
      console.error('Error:', error);
    } finally {
      this.isLoading = false
    }

    this.payrollDate = this.route.snapshot.queryParamMap.get('payrollDate') as string
    this.maxDate = this.setMaxDate(this.payrollDate)
    this.clickInit()
  }

  activityOnInit() {
    for (let i = 0; i < this.reschedule.length; i++) {
      const documentDeadline = this.convertToDate(this.reschedule.at(i)!.documentDeadline);
      this.rescheduleReqDto.push(this.fb.group({
        documentId: [{ value: this.reschedule.at(i)?.documentId, disabled: true }, [Validators.required]],
        activity: [{ value: this.reschedule.at(i)?.activity, disabled: true }, [Validators.required]],
        documentDeadline: [documentDeadline, [Validators.required]]
      }))
    }
  }

  clickInit() {
    for (let i = 0; i < this.rescheduleReqDto.length; i++) {
      var documentDeadline = this.rescheduleReqDto.at(i).get('documentDeadline')?.value
      this.formatDateForSubmission(documentDeadline)
    }
  }

  get rescheduleReqDto() {
    return this.rescheduleForm.get('rescheduleReqDto') as FormArray
  }

  convertToDate(dateString: string | null): Date | null {
    if (!dateString) {
      return null
    }
    return new Date(dateString)
  }

  setMaxDate(dateString: string | null) {
    let maxDate = this.convertToDate(dateString)
    maxDate?.setDate(maxDate.getDate() - 2)
    return maxDate
  }

  formatDate(dateString: string | null) {
    let payrollDate = this.convertToDate(dateString)
    const day = String(payrollDate!.getUTCDate()).padStart(2, '0')
    const month = String(payrollDate!.getUTCMonth() + 1).padStart(2, '0')
    const year = payrollDate!.getUTCFullYear()

    return `${day}/${month}/${year}`
  }

  onDateSelect(event: any, i: number) {
    const selectedDate = new Date(event)
    const dateString = selectedDate.toISOString()

    const documentDeadline = dateString.substring(0, dateString.length - 5)
    this.rescheduleReqDto.at(i)?.patchValue({ documentDeadline: documentDeadline })
  }

  convertToUTC(dateString: string): string {
    const [day, month, year] = dateString.split('/').map(part => parseInt(part, 10))
    const date = new Date(Date.UTC(year, month - 1, day))
    return date.toISOString()
  }

  formatDateForSubmission(dateString: string | null): string | null {
    if (!dateString) {
      return null
    }
    const datePattern = /^\d{2}\/\d{2}\/\d{4}$/

    if (typeof dateString === 'string' && datePattern.test(dateString)) {
      const date = this.convertToUTC(dateString)
      return date
    }

    if (typeof dateString === 'string' && dateString.length > 11) {
      const date = new Date(dateString)
      return date.toISOString()
    }

    return dateString
  }

  onBack() {
    this.location.back()
  }

  onSubmit() {
    if (this.rescheduleForm.valid) {
      const request: UpdateDocumentScheduleReqDto[] = this.rescheduleForm.getRawValue().rescheduleReqDto
      for (let i = 0; i < request.length; i++) {
        const formattedDate = this.formatDateForSubmission(request[i].documentDeadline);
        request[i].documentDeadline = formattedDate as string;
        delete request[i].activity
      }

      firstValueFrom(this.documentService.updateSchedule(request)).then(() => {
        this.location.back()
      })
    }
  }
}
