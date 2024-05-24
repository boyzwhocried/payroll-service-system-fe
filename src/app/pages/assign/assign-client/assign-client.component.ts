import { Component, OnInit } from "@angular/core";
import { AssignService } from "../../../services/assign/assign.service";
import { ActivatedRoute } from "@angular/router";
import { firstValueFrom } from "rxjs";
import { ClientListResDto } from "../../../dto/user/client-list.res.dto";
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { SelectItem } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';
import { Validators, NonNullableFormBuilder, ReactiveFormsModule, FormArray } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { ClientResDto } from "../../../dto/user/client.res.dto";
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ChipModule } from 'primeng/chip';
import { UserResDto } from "../../../dto/user/user.res.dto";
import { ClientAssignmentReqDto } from "../../../dto/client-assignment/client-assignment.req.dto";

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
        ChipModule
    ],
    templateUrl: 'assign-client.component.html'
})

export class AssignClientComponent implements OnInit {
    clientList: ClientListResDto | undefined
    
    psId: string = ''
    psUserName: string = ''
    
    assignedClient: ClientResDto[] = []
    assignedLength: number | undefined

    unassignedClient: ClientResDto[] = []
    
    newlyAssigned: ClientResDto[] = []
    

    clientAssignmentReq = this.formBuilder.group({
        psId: ['', [Validators.required]],
        clients: this.formBuilder.array([])
    })

    constructor(
        private assignService: AssignService,
        private activatedRoute: ActivatedRoute,
        private formBuilder: NonNullableFormBuilder,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.init()
    }

    init() {
        firstValueFrom(this.activatedRoute.params).then(
            (param) => {
                this.psId = param['id']
                this.clientAssignmentReq.patchValue({
                    psId : this.psId
                })
                firstValueFrom(this.assignService.getClientList(this.psId)).then(
                    res => {
                        console.log(res)
                        this.clientList = res
                        this.psUserName = this.clientList.psUserName
                        this.assignedClient = this.clientList.assignedClients
                        this.assignedLength = this.assignedClient.length
                        this.unassignedClient = this.clientList.unassignedClients
                    }
                )
            }
        )
    }

    get clients() {
        return this.clientAssignmentReq.get('clients') as FormArray
    }

    isClientsEmpty(): boolean {
        const length: number = this.clients.length
        return length < 1
    }

    isUnassignedClientsEmpty(): boolean {
        const length: number = this.unassignedClient.length
        return length < 1
    }

    isClientSelected(id: string) {
        const size = this.clients.length
        for(let i=0;i<size;i++) {
            if(this.clients.at(i).value == id) {
                return false
            }
        }
        return true
    }

    isClientRemovable(index: number) {
        return this.assignedLength! < (index + 1)
    }

    generateImage(id: string) {
        return this.assignService.getImageUrl(id)
    }

    addToForm(client: ClientResDto) {
        this.clients.push(this.formBuilder.control(
            client.id as string
        ))

        this.assignedClient.push(client)
    }

    removeFromForm(index: number, client: ClientResDto) {
        const clientId: string = client.id
        const size = this.clients.length
        this.assignedClient.splice(index, 1)
        
        for(let i=0;i<size;i++) {
            const currentId: string = this.clients.at(i).value
            console.log(currentId + " " + clientId)
            if(currentId == client.id) {
                this.clients.removeAt(i)
                break
            }
        }

    }

    onSubmit() {
        console.log('submitted')
        if(this.clientAssignmentReq.valid) {
            const clientAssignmentReqDto: ClientAssignmentReqDto = {
                psId: this.clientAssignmentReq.value.psId as string,
                clients: this.clientAssignmentReq.value.clients as string[]
            }

            firstValueFrom(this.assignService.createClientAssignment(clientAssignmentReqDto)).then(
                response => {
                    this.router.navigateByUrl('/assign')
                },
                error => {
                    this.clients.clear()
                }
            )
        }
    }

    onCancel() {
        this.router.navigateByUrl('/assign')
    }
}