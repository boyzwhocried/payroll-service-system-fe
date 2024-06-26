import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { CompanyResDto } from '../../dto/company/company.res.dto';
import { UpdateCompanyReqDto } from '../../dto/company/update-company.req.dto';
import { CompanyService } from '../../services/company/company.service';
import { CheckboxModule } from 'primeng/checkbox';
import { firstValueFrom } from 'rxjs';
import { ImageModule } from 'primeng/image';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ToastModule,
    TagModule,
    DropdownModule,
    ButtonModule,
    InputTextModule,
    RippleModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    AvatarModule,
    AvatarGroupModule,
    CheckboxModule,
    ImageModule,
    SkeletonModule,
  ],
  templateUrl: './companies.component.html',
  styleUrl: './companies.component.css',
  providers: [MessageService],
})
export class CompaniesComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;

  isEditing = false;
  isHovered = false;
  clonedCompany: { [s: string]: CompanyResDto } = {};
  companies: CompanyResDto[] = [];
  originalFormValues: any;
  isFormUnchanged = true;
  showFilterRow = false;
  isLoading = true
  companiesSkeleton: string[] = [];


  companyForm = this.formBuilder.group({
    id: ['', [Validators.required]],
    companyName: ['', [Validators.required]],
    companyLogoContent: [''],
    companyLogoExtension: [''],
  });

  constructor(
    private companyService: CompanyService,
    private formBuilder: NonNullableFormBuilder
  ) { }

  async ngOnInit(): Promise<void> {
    this.companiesSkeleton = Array.from({ length: 3 }).map((_, i) => `Item #${i}`);
    this.isLoading = true
    await firstValueFrom(this.companyService.getCompanies()).then((response) => {
      this.companies = response;
      this.isLoading = false
    });
  }

  generateImage(id: string) {
    return this.companyService.getImageUrl(id);
  }

  generatePreviewImage(
    contentData: string | undefined,
    extension: string | undefined
  ) {
    return `data:image/${extension};base64,${contentData}`;
  }

  onRowEditInit(company: CompanyResDto) {
    this.clonedCompany[company.id as string] = { ...company };
    this.isEditing = true;
    this.companyForm.patchValue({ ...company });
    this.originalFormValues = this.companyForm.getRawValue();
    firstValueFrom(this.companyForm.valueChanges).then(() => {
      this.checkFormUnchanged();
    });
  }

  checkFormUnchanged() {
    this.isFormUnchanged =
      JSON.stringify(this.companyForm.getRawValue()) ===
      JSON.stringify(this.originalFormValues);
  }

  onRowEditSave(index: number) {
    this.isEditing = false;
    if (this.companyForm.valid) {
      const editedCompany: UpdateCompanyReqDto = this.companyForm.getRawValue();
      firstValueFrom(this.companyService.updateCompanyData(editedCompany)).then(
        (response) => {
          this.companies.at(index)!.companyName = this.companyForm.value
            .companyName as string;
          this.companies.at(index)!.companyLogoContent = this.companyForm.value
            .companyLogoContent as string;
          this.companies.at(index)!.companyLogoExtension = this.companyForm
            .value.companyLogoExtension as string;
          this.companyForm.reset();
          this.originalFormValues = this.companyForm.getRawValue();
          firstValueFrom(this.companyForm.valueChanges).then(() => {
            this.checkFormUnchanged();
          });
        },
        (error) => {
          this.companyForm.reset();
        }
      );
    }
  }

  onRowEditCancel(company: CompanyResDto, index: number) {
    this.companies[index] = this.clonedCompany[company.id as string];
    delete this.clonedCompany[company.id as string];
    this.companyForm.reset();
    this.isEditing = false;
    this.originalFormValues = this.companyForm.getRawValue();
    firstValueFrom(this.companyForm.valueChanges).then(() => {
      this.checkFormUnchanged();
    });
  }

  onAvatarClick(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        this.companyForm.patchValue({
          companyLogoContent: base64,
          companyLogoExtension: file.type.split('/')[1],
        });
      };
      reader.readAsDataURL(file);
    }
  }
}
