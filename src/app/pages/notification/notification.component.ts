import { Component, OnInit } from "@angular/core";
import { NotificationResDto } from "../../dto/notification/notification.res.dto";
import { NotificationService } from "../../services/notification/notification.service";
import { firstValueFrom } from "rxjs";
import { TableModule } from 'primeng/table';
import { BadgeModule } from 'primeng/badge';
import { CommonModule } from "@angular/common";

@Component({
    selector: 'notification-app',
    standalone: true,
    imports: [
        TableModule,
        BadgeModule,
        CommonModule
    ],
    templateUrl: 'notification.component.html',
    styleUrl: 'notification.component.css'
})

export class NotificationComponent implements OnInit {
    notifications: NotificationResDto[] = []
    isHovered: Boolean = false

    constructor(
        private notificationService: NotificationService
    ) {}

    ngOnInit(): void {
        this.init()
    }

    init() {
        firstValueFrom(this.notificationService.getNotifications()).then(
            response => {
                this.notifications = response
            }
        )
    }

    isUnread(isActive: Boolean) {
        return isActive
    }

    onClickNotification(isActive: boolean, id: string) {
        if(isActive) {
            firstValueFrom(this.notificationService.readNotification(id)).then(
                () => {
                    console.log('okay')
                }
            )
        }
    }

    deleteNotification(id: string, index: number) {
        firstValueFrom(this.notificationService.deleteNotification(id)).then(
            () => {
                this.notifications.splice(index, 1)
            }
        )
    }
}