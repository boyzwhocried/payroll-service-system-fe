import { Component, OnInit } from '@angular/core';
import { AssignService } from '../../../services/assign/assign.service';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ClientListResDto } from '../../../dto/user/client-list.res.dto';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { RippleModule } from 'primeng/ripple';
import {
  Validators,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  FormArray,
} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { ClientResDto } from '../../../dto/user/client.res.dto';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ChipModule } from 'primeng/chip';
import { ClientAssignmentReqDto } from "../../../dto/client-assignment/client-assignment.req.dto";
import { SkeletonModule } from "primeng/skeleton";
import { ImageModule } from "primeng/image";
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'assign-client',
  standalone: true,
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
    ScrollPanelModule,
    ChipModule,
    SkeletonModule,
    ImageModule,
    ToastModule,
    ConfirmDialogModule,
  ],
  templateUrl: 'assign-client.component.html',
  providers: [MessageService, ConfirmationService]
})
export class AssignClientComponent implements OnInit {

  clientList: ClientListResDto | undefined

  psId: string = ''
  psUserName: string = ''

  assignedClient: ClientResDto[] = []
  assignedLength: number | undefined

  unassignedClient: ClientResDto[] = []

  newlyAssigned: ClientResDto[] = []

  isLoading = true
  unassignedClientSkeleton: string[] = []
  clientAssignmentReq = this.formBuilder.group({
    psId: ['', [Validators.required]],
    clients: this.formBuilder.array([]),
  });

  async ngOnInit(): Promise<void> {
    this.isLoading = true
    this.unassignedClientSkeleton = Array.from({ length: 3 }).map((_, i) => `Item #${i}`);
    await firstValueFrom(this.activatedRoute.params).then(
      (param) => {
        this.psId = param['id']
        this.clientAssignmentReq.patchValue({
          psId: this.psId
        })
        firstValueFrom(this.assignService.getClientList(this.psId)).then(
          res => {
            this.clientList = res
            this.psUserName = this.clientList.psUserName
            this.assignedClient = this.clientList.assignedClients
            this.assignedLength = this.assignedClient.length
            this.unassignedClient = this.clientList.unassignedClients
            this.isLoading = false
          }
        )
      }
    )
  }

  constructor(
    private assignService: AssignService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: NonNullableFormBuilder,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  get clients() {
    return this.clientAssignmentReq.get('clients') as FormArray;
  }

  isClientsEmpty(): boolean {
    const length: number = this.clients.length;
    return length < 1;
  }

  isUnassignedClientsEmpty(): boolean {
    const length: number = this.unassignedClient.length;
    return length < 1;
  }

  isClientSelected(id: string) {
    const size = this.clients.length;
    for (let i = 0; i < size; i++) {
      if (this.clients.at(i).value == id) {
        return false;
      }
    }
    return true;
  }

  isClientRemovable(index: number) {
    return this.assignedLength! < index + 1;
  }

  generateImage(id: string) {
    return this.assignService.getImageUrl(id);
  }

  addToForm(client: ClientResDto) {
    this.clients.push(this.formBuilder.control(client.id as string));

    this.assignedClient.push(client);
  }

  removeFromForm(index: number, client: ClientResDto) {
    const clientId: string = client.id;
    const size = this.clients.length;
    this.assignedClient.splice(index, 1);

    for (let i = 0; i < size; i++) {
      const currentId: string = this.clients.at(i).value;
      if (currentId == client.id) {
        this.clients.removeAt(i);
        break;
      }
    }
  }

  assignClient() {
    console.log('submitted');
    if (this.clientAssignmentReq.valid) {
      const clientAssignmentReqDto: ClientAssignmentReqDto = {
        psId: this.clientAssignmentReq.value.psId as string,
        clients: this.clientAssignmentReq.value.clients as string[],
      };

      firstValueFrom(
        this.assignService.createClientAssignment(clientAssignmentReqDto)
      ).then(
        (response) => {
          this.router.navigateByUrl('/assign');
        },
        (error) => {
          this.clients.clear();
        }
      );
    }
  }

  onCancel() {
    this.router.navigateByUrl('/assign');
  }

  confirm() {
    this.confirmationService.confirm({
      header: 'Are you sure?',
      message: 'Please confirm to proceed.',
      accept: () => {
        this.assignClient();
      },
      reject: () => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Rejected',
          detail: 'You have rejected',
          life: 2500,
        });
      },
    });
  }
}
