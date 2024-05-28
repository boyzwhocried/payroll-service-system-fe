import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';
import { StepperResDto } from '../../models/dto/stepper/stepper.res.dto';
import { StepperService } from '../../services/stepper.service';
import { firstValueFrom } from 'rxjs';
import { FileUploadModule } from 'primeng/fileupload';
import { DocumentReqDto } from '../../models/dto/stepper/document.req.dto';
import { TagModule } from 'primeng/tag';
import { AuthService } from '../../services/auth/auth.service';
import { RoleType } from '../../constants/role.const';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { UpdateCalculatedDocumentReqDto } from '../../models/dto/stepper/update-calculated-document.req.dto';

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
    ButtonModule,
    ReactiveFormsModule,
    RouterModule,
    FileUploadModule,
    StepperModule,
    TagModule,
    NgxDocViewerModule,
  ],
})
export class Stepper implements OnInit {
  date: Date | undefined;
  stepperDocuments!: StepperResDto;
  documentIndex!: number;
  scheduleId!: string;

  allClientDocumentsComplete: boolean = false;
  loginData = this.authService.getLoginData();

  documentReqDtoFg = this.fb.group({
    documentId: ['', [Validators.required]],
    documentName: ['', [Validators.required]],
    scheduleId: ['', [Validators.required]],
    base64: ['', [Validators.required]],
    clientAssignmentId: ['', [Validators.required]],
    isSignedByPS: [false, [Validators.required]],
    isSignedByClient: [false, [Validators.required]],
  });

  updateCalculatedDocumentReqDtoFg = this.fb.group({
    scheduleId: ['', [Validators.required]],
    clientAssignmentId: ['', [Validators.required]],
    documents: this.fb.array([]),
  });

  constructor(
    private activeRoute: ActivatedRoute,
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

  get documents() {
    return this.updateCalculatedDocumentReqDtoFg.get('documents') as FormArray;
  }

  fileUpload(
    event: any,
    documentId: string,
    documentIndex: number,
    isFinal: boolean
  ) {
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

        if (!isFinal) {
          this.documentReqDtoFg.patchValue({
            documentId: documentId,
            base64: resultBase64,
            documentName: file.name,
            clientAssignmentId: this.stepperDocuments.clientAssignmentId,
            scheduleId: this.scheduleId,
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
        } else {
          this.documents.at(documentIndex).patchValue({
            documentId: documentId,
            base64: resultBase64,
            documentName: file.name,
          });
        }
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

  submitFinalDocument() {
    if (this.updateCalculatedDocumentReqDtoFg.valid) {
      const updateCalculatedDocumentReqDto: any =
        this.updateCalculatedDocumentReqDtoFg.getRawValue();

      console.log(firstValueFrom);

      firstValueFrom(
        this.stepperService.saveFinalDocument(updateCalculatedDocumentReqDto)
      );
    }
  }

  pingClient() {
    firstValueFrom(
      this.stepperService.pingClient(this.stepperDocuments.clientAssignmentId)
    );
  }

  downloadDocument(documentId: string) {
    window.open(
      `http://localhost:8080/documents/download/${documentId}`,
      '_blank'
    );
  }

  downloadFinalDocument(documentId: string) {
    window.open(`http://localhost:8080/documents/final/download/${documentId}`);
  }

  ngOnInit(): void {
    firstValueFrom(this.activeRoute.params)
      .then((param) => {
        this.scheduleId = param['scheduleId'];
      })
      .then(() => {
        firstValueFrom(this.stepperService.getDocuments(this.scheduleId)).then(
          (res) => {
            this.stepperDocuments = res;
            for (let data of this.stepperDocuments.calculatedDataResDto) {
              this.documents.push(
                this.fb.group({
                  documentId: ['', [Validators.required]],
                  base64: ['', [Validators.required]],
                  documentName: ['', [Validators.required]],
                })
              );
              this.updateCalculatedDocumentReqDtoFg.patchValue({
                scheduleId: this.scheduleId,
                clientAssignmentId: this.stepperDocuments.clientAssignmentId,
              });
            }
          }
        );
      });
  }
}
