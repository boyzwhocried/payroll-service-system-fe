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
import { AuthService } from '../../services/auth/auth.service';
import { RoleType } from '../../constants/role.const';

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
  loginData = this.authService.getLoginData();

  documentReqDtoFg = this.fb.group({
    documentId: ['', [Validators.required]],
    documentName: ['', [Validators.required]],
    base64: ['', [Validators.required]],
    clientAssignmentId: ['', [Validators.required]],
    isSignedByPS: [false, [Validators.required]],
    isSignedByClient: [false, [Validators.required]],
  });

  scheduleId: string = '990094b8-9255-428b-a907-65adec574a4b';

  constructor(
    private stepperService: StepperService,
    private fb: NonNullableFormBuilder,
    private authService: AuthService
  ) {}

  get isClient() {
    return this.loginData?.roleCode == RoleType.CLIENT;
  }

  get isPS() {
    return this.loginData?.roleCode == RoleType.PAYROLL_SERVICE;
  }

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
        });
        if (this.isPS) {
          this.documentReqDtoFg.patchValue({
            isSignedByPS: true,
            isSignedByClient: true,
          });
        } else {
          this.documentReqDtoFg.patchValue({
            isSignedByClient: true,
          });
        }

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
              if (this.isPS) {
                item.isSignedByPs = true;
              } else {
                if (!item.isSignedByClient) {
                  item.isSignedByClient = true;
                }
              }
            }
          });

          this.documentReqDtoFg.reset();
        }
      );
    }
  }

  pingClient() {
    firstValueFrom(
      this.stepperService.pingClient(this.stepperDocuments.clientAssignmentId)
    );
  }

  ngOnInit(): void {
    firstValueFrom(this.stepperService.getDocuments(this.scheduleId)).then(
      (res) => {
        this.stepperDocuments = res;
      }
    );
  }
}
