import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';
import { StepperResDto } from '../../dto/stepper/stepper.res.dto';
import { PayrollStepperService } from '../../services/payroll-stepper.service';
import { firstValueFrom } from 'rxjs';
import { FileUploadModule } from 'primeng/fileupload';
import { DocumentReqDto } from '../../dto/stepper/document.req.dto';
import { TagModule } from 'primeng/tag';
import { AuthService } from '../../services/auth/auth.service';
import { RoleType } from '../../constants/roles.constant';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { environment } from '../../../env/environment.prod';
import mammoth from 'mammoth';
import { DialogModule } from 'primeng/dialog';
import * as xlsx from 'xlsx';
import { TableModule } from 'primeng/table';
import * as pdfjs from 'pdfjs-dist';
import { ButtonIconService } from '../../services/button-icon.service';

@Component({
  selector: 'app-stepper',
  standalone: true,
  templateUrl: './payrolls.component.html',
  styleUrl: './payrolls.component.css',
  imports: [
    CommonModule,
    ButtonModule,
    ReactiveFormsModule,
    RouterModule,
    FileUploadModule,
    StepperModule,
    DialogModule,
    TagModule,
    NgxDocViewerModule,
    TableModule,
  ],
})
export class Payrolls implements OnInit {
  date: Date | undefined;
  stepperDocuments!: StepperResDto;
  documentIndex!: number;
  scheduleId!: string;
  docVisible: boolean = false;
  docHeader!: string;
  docBody!: any;
  xmlJson!: any;
  pdfPages: number[] = [];
  isExcel: boolean = false;
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
    private stepperService: PayrollStepperService,
    private fb: NonNullableFormBuilder,
    private authService: AuthService,
    private location: Location,
    public buttonIconService: ButtonIconService
  ) {}

  get isClient() {
    return this.loginData?.roleCode == RoleType.CLIENT;
  }

  get isPS() {
    return this.loginData?.roleCode == RoleType.PS;
  }

  get documents() {
    return this.updateCalculatedDocumentReqDtoFg.get('documents') as FormArray;
  }

  formatDate(date: string) {
    const fDate = new Date(date);
    return fDate;
  }

  fileUpload(
    event: any,
    documentId: string,
    documentIndex: number,
    isFinal: boolean
  ) {
    this.buttonIconService.toggleSubmitIcon();
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
      toBase64(file)
        .then((result) => {
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
        })
        .then(() => {
          this.buttonIconService.toggleSubmitIcon();
        });
    }
  }

  submitDocument() {
    if (this.documentReqDtoFg.valid) {
      this.buttonIconService.toggleSubmitIcon();
      const documentReqDto: DocumentReqDto =
        this.documentReqDtoFg.getRawValue();

      firstValueFrom(this.stepperService.saveDocument(documentReqDto))
        .then(() => {
          this.stepperDocuments.documentsRes.forEach((item, index) => {
            if (index == this.documentIndex) {
              if (this.isPS) {
                item.isSignedByPs = true;
              } else {
                if (!item.isSignedByClient) {
                  item.isSignedByClient = true;
                }
              }
              item.documentName = documentReqDto.documentName;
            }
          });
        })
        .then(() => {
          this.documentReqDtoFg.reset();
          this.buttonIconService.toggleSubmitIcon();
        });
    }
  }

  submitFinalDocument() {
    if (this.updateCalculatedDocumentReqDtoFg.valid) {
      this.buttonIconService.toggleSubmitIcon();
      const updateCalculatedDocumentReqDto: any =
        this.updateCalculatedDocumentReqDtoFg.getRawValue();

      firstValueFrom(
        this.stepperService.saveFinalDocument(updateCalculatedDocumentReqDto)
      ).then(() => {
        this.buttonIconService.toggleSubmitIcon();
      });
    }
  }

  pingClient() {
    this.buttonIconService.togglePingIcon();
    this.buttonIconService.pingIsLoading = true;
    firstValueFrom(this.stepperService.pingClient(this.scheduleId)).then(() => {
      this.buttonIconService.togglePingIcon();
    });
  }

  downloadDocument(documentId: string) {
    window.open(
      `${environment.backEndBaseUrl}:${environment.port}/documents/download/${documentId}`,
      '_blank'
    );
  }

  downloadFinalDocument(documentId: string) {
    window.open(
      `${environment.backEndBaseUrl}:${environment.port}/documents/final/download/${documentId}`
    );
  }

  downloadReport() {
    window.open(
      `${environment.backEndBaseUrl}:${environment.port}/reports/${this.scheduleId}`
    );
  }

  async previewPdf(pdfFile: File) {
    pdfjs.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

    this.docVisible = true;

    const pdfData = await pdfFile.arrayBuffer();

    const pdf = await pdfjs.getDocument(pdfData).promise;

    for (let i = 0; i < pdf.numPages; i++) {
      this.pdfPages.push(i);
    }

    const totalPageNumber: number = pdf.numPages;

    setTimeout(async () => {
      for (let pageNum = 1; pageNum <= totalPageNumber; pageNum++) {
        const canvas = document.getElementById(
          `pdfCanvas-${pageNum}`
        ) as HTMLCanvasElement;

        await this.renderPage(pdf, pageNum, canvas);
      }
    }, 1);
  }

  async renderPage(
    pdf: pdfjs.PDFDocumentProxy,
    pageNumber: number,
    canvas: HTMLCanvasElement
  ): Promise<void> {
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 1 });
    const context = canvas.getContext('2d')!;
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    await page.render({ canvasContext: context, viewport }).promise;
  }

  async previewDocx(previewFile: File) {
    const fileData = await previewFile.arrayBuffer();

    mammoth
      .convertToHtml({ arrayBuffer: fileData })
      .then((resultObject) => {
        this.docBody = resultObject.value;
      })
      .then(() => {
        this.docVisible = true;
      });
  }

  async previewXls(previewFile: File) {
    const fileData = await previewFile.arrayBuffer();

    const workbook = xlsx.read(fileData);
    const sheetName = workbook.SheetNames[0];
    const workSheet = workbook.Sheets[sheetName];
    this.xmlJson = xlsx.utils.sheet_to_json(workSheet, { header: 1 });
    this.isExcel = !this.isExcel;
    this.docVisible = true;
  }

  previewDocument(documentId: string, documentName: string) {
    this.buttonIconService.togglePreviewIcon();
    const fileType = documentName.split('.').at(1);
    this.pdfPages = [];
    firstValueFrom(this.stepperService.getPreviewDocument(documentId))
      .then((res) => {
        this.docBody = '';
        this.xmlJson = [[]];
        this.docHeader = documentName;
        const blobFile = res.body;
        const previewFile = new File([blobFile as any], 'output.pdf', {
          type: 'application/pdf',
        });
        if (fileType === 'pdf') {
          this.previewPdf(previewFile);
        } else if (fileType === 'doc' || fileType === 'docx') {
          this.previewDocx(previewFile);
        } else if (fileType === 'xls' || fileType === 'xlsx') {
          this.previewXls(previewFile);
        }
      })
      .then(() => {
        this.buttonIconService.togglePreviewIcon();
      });
  }

  onBack() {
    this.location.back();
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
