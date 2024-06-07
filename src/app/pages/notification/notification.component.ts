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
import { SkeletonModule } from 'primeng/skeleton';
import { ImageModule } from 'primeng/image';
import { AuthService } from '../../services/auth/auth.service';
import { BackButtonComponent } from '../../components/back-button/back-button.component';

@Component({
  selector: 'notification-app',
  standalone: true,
  templateUrl: 'notification.component.html',
  styleUrl: 'notification.component.css',
  imports: [
    TableModule,
    BadgeModule,
    CommonModule,
    ButtonModule,
    ConfirmDialogModule,
    ToastModule,
    SkeletonModule,
    ImageModule,
    BackButtonComponent,
  ],
  providers: [ConfirmationService, MessageService],
})
export class NotificationComponent implements OnInit {
  notifications: NotificationResDto[] = [];
  userId: string = this.authService.getLoginData().userId;
  isHovered: Boolean = false;
  isLoading: Boolean = true;

  constructor(
    private notificationService: NotificationService,
    private router: Router,
    private location: Location,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private authService: AuthService
  ) {}

  async ngOnInit(): Promise<void> {
    this.init();
    try {
      this.isLoading = true;
      await firstValueFrom(this.notificationService.getNotifications()).then(
        (response) => {
          this.notifications = response;
        }
      );
    } catch (error) {
      console.error('Error:', error);
    } finally {
      this.isLoading = false;
    }
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

  deleteAllNotification() {
    const id: string = this.userId;
    firstValueFrom(this.notificationService.deleteAllNotification(id)).then(
      () => {
        this.notifications = [];
      }
    );
  }

  readAllNotification() {
    const id: string = this.userId;
    firstValueFrom(this.notificationService.readAllNotification(id)).then(
      () => {
        this.notifications.forEach((notification) => {
          notification.isActive = false;
        });
      }
    );
  }

  onBack() {
    this.location.back();
  }

  confirm(id?: string, index?: number, isActive?: boolean) {
    this.confirmationService.confirm({
      header: 'Are you sure?',
      message: 'Please confirm to proceed.',
      accept: () => {
        if (id && index) {
          this.deleteNotification(id, index, isActive!);
        } else if (id == 'readAll') {
          this.readAllNotification();
        } else {
          this.deleteAllNotification();
        }
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
