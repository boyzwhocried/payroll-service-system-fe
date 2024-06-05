import { CommonModule, Location } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { firstValueFrom } from "rxjs";
import { NotificationResDto } from "../../dto/notification/notification.res.dto";
import { NotificationService } from "../../services/notification/notification.service";
import { SkeletonModule } from 'primeng/skeleton';
import { ImageModule } from "primeng/image";

@Component({
    selector: 'notification-app',
    standalone: true,
    imports: [
        TableModule,
        BadgeModule,
        CommonModule,
        ButtonModule,
        SkeletonModule,
        ImageModule,
    ],
    templateUrl: 'notification.component.html',
    styleUrl: 'notification.component.css'
})

export class NotificationComponent implements OnInit {
    notifications: NotificationResDto[] = []

    isHovered: Boolean = false
    isLoading = true

    constructor(
        private notificationService: NotificationService,
        private router: Router,
        private location: Location,
    ) { }

    async ngOnInit(): Promise<void> {
        this.init()
        try {
            this.isLoading = true
            await firstValueFrom(this.notificationService.getNotifications()).then(response => {this.notifications = response})
        } catch (error) {
            console.error('Error:', error);
        } finally {
            this.isLoading = false
        }
    }

    init() {

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