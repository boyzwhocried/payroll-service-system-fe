import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
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
  ],
  templateUrl: './companies.component.html',
  styleUrl: './companies.component.css',
  providers: [MessageService]
})
export class CompaniesComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;

  isEditing = false;
  isHovered = false;
  clonedCompany: { [s: string]: CompanyResDto } = {}
  companies: CompanyResDto[] = []
  originalFormValues: any;
  isFormUnchanged = true;
  showFilterRow = false;

  companyForm = this.formBuilder.group({
    id: ['', [Validators.required]],
    companyName: ['', [Validators.required]],
    companyLogoContent: [''],
    companyLogoExtension: [''],
  });

  constructor(
    private companyService: CompanyService,
    private formBuilder: NonNullableFormBuilder
  ) {
    firstValueFrom(this.companyService.getCompanies()).then(response => { this.companies = response })
  }

  generateImage(id: string) {
    return this.companyService.getImageUrl(id)
  }

  generatePreviewImage(contentData: string | undefined, extension: string | undefined) {
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
    this.isFormUnchanged = JSON.stringify(this.companyForm.getRawValue()) === JSON.stringify(this.originalFormValues);
  }

  onRowEditSave() {
    this.isEditing = false
    if (this.companyForm.valid) {
      const editedCompany: UpdateCompanyReqDto = this.companyForm.getRawValue()
      this.companyService.updateCompanyData(editedCompany).subscribe({
        next: (response) => {
          this.companyForm.reset()
        },
        error: (error) => console.error('Update failed:', error),
        complete: () => {
          console.log('Update company complete')
          this.companyForm.reset()
        }
      })
    }
  }

  onRowEditCancel(company: CompanyResDto, index: number) {
    this.companies[index] = this.clonedCompany[company.id as string]
    delete this.clonedCompany[company.id as string]
    this.companyForm.reset();
    this.isEditing = false;
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
          companyLogoContent: base64, companyLogoExtension: file.type.split('/')[1]
        })
      };
      reader.readAsDataURL(file);
    }
  }

}
