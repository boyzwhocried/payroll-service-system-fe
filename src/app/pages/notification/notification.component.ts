import { CommonModule, Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { firstValueFrom } from 'rxjs';
import { NotificationResDto } from '../../dto/notification/notification.res.dto';
import { NotificationService } from '../../services/notification/notification.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'notification-app',
  standalone: true,
  imports: [
    TableModule,
    BadgeModule,
    CommonModule,
    ButtonModule,
    ConfirmDialogModule,
    ToastModule,
  ],
  templateUrl: 'notification.component.html',
  styleUrl: 'notification.component.css',
  providers: [ConfirmationService, MessageService],
})
export class NotificationComponent implements OnInit {
  notifications: NotificationResDto[] = [];

  isHovered: Boolean = false;

  constructor(
    private notificationService: NotificationService,
    private router: Router,
    private location: Location,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.init();
  }

  init() {
    firstValueFrom(this.notificationService.getNotifications()).then(
      (response) => {
        this.notifications = response;
      }
    );
  }

  isUnread(isActive: Boolean) {
    return isActive;
  }

  onClickNotification(notification: NotificationResDto) {
    firstValueFrom(
      this.notificationService.readNotification(notification.notificationId)
    ).then(() => {
      this.router.navigateByUrl(`${notification.routeLink}`);
    });
  }

  deleteNotification(id: string, index: number, isActive: boolean) {
    firstValueFrom(
      this.notificationService.deleteNotification(id, isActive)
    ).then(() => {
      this.notifications.splice(index, 1);
    });
  }

  onBack() {
    this.location.back();
  }

  confirm(id: string, index: number, isActive: boolean) {
    this.confirmationService.confirm({
      header: 'Are you sure?',
      message: 'Please confirm to proceed.',
      accept: () => {
        this.deleteNotification(id, index, isActive);
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'You have rejected',
          life: 2500,
        });
      },
    });
  }
}
