import { CommonModule, Location } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { firstValueFrom } from "rxjs";
import { NotificationResDto } from "../../dto/notification/notification.res.dto";
import { NotificationService } from "../../services/notification/notification.service";

@Component({
    selector: 'notification-app',
    standalone: true,
    imports: [
        TableModule,
        BadgeModule,
        CommonModule,
        ButtonModule
    ],
    templateUrl: 'notification.component.html',
    styleUrl: 'notification.component.css'
})

export class NotificationComponent implements OnInit {
    notifications: NotificationResDto[] = []

    isHovered: Boolean = false

    constructor(
        private notificationService: NotificationService,
        private router: Router,
        private location: Location,
    ) { }

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

    onClickNotification(notification: NotificationResDto) {
        firstValueFrom(this.notificationService.readNotification(notification.notificationId)).then(
            () => {
                this.router.navigateByUrl(`${notification.routeLink}`)
            }
        )
    }

    deleteNotification(id: string, index: number, isActive: boolean) {
        firstValueFrom(this.notificationService.deleteNotification(id, isActive)).then(
            () => {
                this.notifications.splice(index, 1)
            }
        )
    }

    onBack() {
        this.location.back()
    }
}