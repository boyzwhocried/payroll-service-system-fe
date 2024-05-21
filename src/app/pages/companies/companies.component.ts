import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { CompanyService } from '../../services/company/company.service';
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
  ],
  templateUrl: './companies.component.html',
  styleUrl: './companies.component.css',
  providers: [MessageService]
})
export class CompaniesComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;

  isEditing = false;
  isHovered = false;
  originalCompanyData: CompanyResDto | null = null;

  companyForm = this.formBuilder.group({
    id: ['', [Validators.required]],
    companyName: ['', [Validators.required]],
    companyLogoContent: ['', [Validators.required]],
    companyLogoExtension: ['', [Validators.required]],
  });

  get isEditingCompany() {
    return this.isEditing
  }

  companies: CompanyResDto[] = []

  constructor(
    private messageService: MessageService,
    private companyService: CompanyService,
    private formBuilder: NonNullableFormBuilder,
  ) { }

  ngOnInit() {
    this.init()
  }

  init() {
    firstValueFrom(this.companyService.getCompanies()).then(
      res => {
        this.companies = res
        console.log(res)
      }
    )
  }

  generateImage(id: string) {
    
    return this.companyService.getImageUrl(id)
  }

  onCreateClick() {
    // Handle create click
  }

  onRowEditInit(company: CompanyResDto) {
    this.isEditing = true;
    this.originalCompanyData = { ...company };
    this.companyForm.patchValue(company);
  }

  onRowEditSave(company: CompanyResDto) {
    // const editedCompany: CompanyReqDto = this.companyForm.getRawValue() as CompanyReqDto;

    // // Update the original data with the edited data
    // const index = this.companies.findIndex(c => c.id === company.id);
    // if (index !== -1) {
    //   this.companies[index] = { ...this.companies[index], ...editedCompany };
    // }

    // // Clear the form group
    // this.companyForm.reset();
    // this.isEditing = false;
    // this.originalCompanyData = null;

    // this.messageService.add({ severity: 'success', summary: 'Success', detail: `User is updated` });
  }

  onRowEditCancel(company: CompanyResDto, index: number) {
    if (this.originalCompanyData) {
      this.companies[index] = { ...this.originalCompanyData };
      this.originalCompanyData = null;
    }
    this.companyForm.reset();
    this.isEditing = false;
  }

  onSubmit() {
    if(this.companyForm.valid) {
      
    }
  }

  onAlert() {
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
        this.companyForm.patchValue({ companyLogoContent: base64, companyLogoExtension: file.type.split('/')[1] })
      };

      reader.readAsDataURL(file);
    }
  }


}
