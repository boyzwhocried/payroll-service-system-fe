import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { StepperModule } from 'primeng/stepper';
import { StepperResDto } from '../../models/dto/stepper/stepper.res.dto';
import { StepperService } from '../../services/stepper.service';
import { firstValueFrom } from 'rxjs';
import { FileUploadModule } from 'primeng/fileupload';
import { DocumentReqDto } from '../../models/dto/stepper/document.req.dto';
import { TagModule } from 'primeng/tag';

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
  selector: 'app-stepper',
  standalone: true,
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.css',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    ReactiveFormsModule,
    CardModule,
    BadgeModule,
    RouterModule,
    DialogModule,
    FileUploadModule,
    InputTextModule,
    ToastModule,
    StepperModule,
    TagModule,
  ],
})
export class Stepper implements OnInit {
  stepperDocuments!: StepperResDto;
  documentIndex!: number;
  allClientDocumentsComplete: boolean = false;

  documentReqDtoFg = this.fb.group({
    documentId: ['', [Validators.required]],
    documentName: ['', [Validators.required]],
    base64: ['', [Validators.required]],
    clientAssignmentId: ['', [Validators.required]],
    isSignedByPS: [false, [Validators.required]],
  });

  scheduleId: string = '01a346c2-8a00-44a3-b80b-337d27963628';

  constructor(
    private stepperService: StepperService,
    private fb: NonNullableFormBuilder
  ) {}

  fileUpload(event: any, documentId: string, documentIndex: number) {
    const toBase64 = (file: File) =>
      new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          if (typeof reader.result === 'string') resolve(reader.result);
        };
        reader.onerror = (error) => reject(error);
      });

    for (let file of event.files) {
      toBase64(file).then((result) => {
        const resultBase64 = result.substring(
          result.indexOf(',') + 1,
          result.length
        );

        this.documentReqDtoFg.patchValue({
          documentId: documentId,
          base64: resultBase64,
          documentName: file.name,
          clientAssignmentId: this.stepperDocuments.clientAssignmentId,
          isSignedByPS: true,
        });

        this.documentIndex = documentIndex;
      });
    }
  }

  submitDocument() {
    if (this.documentReqDtoFg.valid) {
      const documentReqDto: DocumentReqDto =
        this.documentReqDtoFg.getRawValue();

      firstValueFrom(this.stepperService.saveDocument(documentReqDto)).then(
        () => {
          this.stepperDocuments.documentsRes.forEach((item, index) => {
            if (index == this.documentIndex) {
              item.isSignedByPs = true;
            }
          });

          this.documentReqDtoFg.reset();
        }
      );
    }
  }

  ngOnInit(): void {
    firstValueFrom(this.stepperService.getDocuments(this.scheduleId)).then(
      (res) => {
        this.stepperDocuments = res;
      }
    );
  }
}
