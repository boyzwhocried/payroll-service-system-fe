import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { PsListResDto } from "../../dto/user/ps-list.res.dto";
import { AssignService } from "../../services/assign/assign.service";
import { firstValueFrom } from "rxjs";
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { SelectItem } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';
import { Validators, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { environment } from '../../../env/environment.prod';
import { ImageModule } from "primeng/image";
import { SkeletonModule } from "primeng/skeleton";

@Component({
    selector: 'assign-app',
    standalone: true,
    templateUrl: 'assign.component.html',
    imports: [
        CommonModule,
        TableModule,
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
        ImageModule,
        SkeletonModule,
    ]
})

export class AssignComponent implements OnInit {
    psList: PsListResDto[] = []
    psListSkeleton: string[] = []
    isLoading = true

    constructor(
        private assignService: AssignService,
        private router: Router
    ) { }

    async ngOnInit(): Promise<void> {
        this.psListSkeleton = Array.from({ length: 3 }).map((_, i) => `Item #${i}`);
        this.isLoading = true
        await firstValueFrom(this.assignService.getPsList()).then(
            res => {
                this.psList = res
                this.isLoading = false
            }
        )
    }

    generateImage(id: string) {
        return this.assignService.getImageUrl(id)
    }

    click(id: string) {
        this.router.navigateByUrl(`/assign/${id}`)
    }
}