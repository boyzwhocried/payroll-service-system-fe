import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MenuItem, PrimeIcons } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { environment } from '../../../env/environment.prod';
import { AuthService } from '../../services/auth/auth.service';
import { NotificationService } from '../../services/notification/notification.service';
import { UserService } from '../../services/user/user.service';
import { RoleType } from '../../constants/roles.constant';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    MenubarModule,
    RouterModule,
    AvatarModule,
    BadgeModule,
    MenuModule,
    ButtonModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {
  allItem: MenuItem[] | undefined
  saItem: MenuItem[] | undefined
  clientItem: MenuItem[] | undefined
  psItem: MenuItem[] | undefined
  notificationItem: MenuItem[] | undefined
  userItem: MenuItem[] | undefined
  menuItem: MenuItem[] | undefined

  notificationCount: number = 0
  notificationObservable: any

  file = {
    fileContent: '',
    fileExtension: ''
  }

  fileObservable: any

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private userService: UserService,
    private router: Router
  ) {
    this.notificationObservable = this.notificationService.countObservable.subscribe(
      next => this.notificationCount = next
    )

    this.fileObservable = this.userService.fileObservable.subscribe(
      next => {
        this.file = next as any
      }
    )
  }

  ngOnInit() {
    this.initMenuItems();
    this.initNotifications();
    this.setMenuItemsBasedOnRole();
  }

  private initMenuItems() {
    this.userItem = [
      {
        label: 'Profile',
        routerLink: '/profile',
        icon: PrimeIcons.USER,
      },
      {
        label: 'Change Password',
        routerLink: '/change-password',
        icon: PrimeIcons.LOCK,
      },
      {
        separator: true,
      },
      {
        label: 'Logout',
        icon: PrimeIcons.SIGN_OUT,
        routerLink: '/login',
        command: () => {
          localStorage.clear()
          this.notificationObservable.unsubscribe()
          this.fileObservable.unsubscribe()
        }
      },
    ];

    this.notificationItem = [
      {
        icon: PrimeIcons.BELL,
        routerLink: '/notification'
      }
    ];

    this.allItem = [
      {
        label: 'Users',
        icon: PrimeIcons.USERS,
        items: [
          {
            label: 'List',
            routerLink: '/users',
            icon: PrimeIcons.LIST,
          },
          {
            label: 'Create',
            routerLink: '/users/new',
            icon: PrimeIcons.PLUS,
          },
        ]
      },
      {
        label: 'Companies',
        icon: PrimeIcons.BUILDING,
        routerLink: '/companies'
      },
      {
        label: 'Assign',
        routerLink: '/assign',
        icon: PrimeIcons.BOOK,
      },
      {
        label: 'Schedule',
        routerLink: '/schedules',
        icon: PrimeIcons.CALENDAR_CLOCK,
      },
      {
        label: 'Chat',
        routerLink: `/chat/${this.authService.getLoginData().userId}`,
        icon: PrimeIcons.COMMENTS,
      },
      {
        label: 'Schedules',
        routerLink: '/schedules',
        icon: PrimeIcons.CALENDAR_CLOCK,
      },
      { separator: true },
      ...this.notificationItem,

    ];

    this.saItem = [
      {
        label: 'Users',
        icon: PrimeIcons.USERS,
        items: [
          {
            label: 'List',
            routerLink: '/users',
            icon: PrimeIcons.LIST,
          },
          {
            label: 'Create',
            routerLink: '/users/new',
            icon: PrimeIcons.PLUS,
          },
        ]
      },
      {
        label: 'Companies',
        icon: PrimeIcons.BUILDING,
        items: [
          {
            label: 'List',
            routerLink: '/companies',
            icon: PrimeIcons.LIST,
          },
          {
            label: 'Create',
            routerLink: '/companies/new',
            icon: PrimeIcons.PLUS,
          },
        ]
      },
      {
        label: 'Assign',
        routerLink: '/assign',
        icon: PrimeIcons.BOOK,
      },
      { separator: true },

    ];

    this.clientItem = [
      {
        label: 'Schedule',
        routerLink: '/schedules',
        icon: PrimeIcons.CALENDAR_CLOCK,
      },
      {
        label: 'Chat',
        routerLink: `/chat/${this.authService.getLoginData().userId}`,
        icon: PrimeIcons.COMMENTS,
      },
      { separator: true },

    ];

    this.psItem = [
      {
        label: 'Schedules',
        routerLink: '/schedules',
        icon: PrimeIcons.CALENDAR_CLOCK,
      },
      { separator: true },

    ];
  }

  private initNotifications() {
    this.notificationService.getNotificationCount()
  }

  private setMenuItemsBasedOnRole() {
    const roleCode = this.authService.getLoginData().roleCode;
    switch (roleCode) {
      case RoleType.CLIENT:
        this.menuItem = this.clientItem;
        break;
      case RoleType.PS:
        this.menuItem = this.psItem;
        break;
      case RoleType.SUPER_ADMIN:
        this.menuItem = this.saItem;
        break;
      default:
        this.menuItem = this.allItem;
        break;
    }
  }

  isAvatarUpdated() {
    return ((this.file.fileContent) && (this.file.fileExtension))
  }

  getProfileImage() {
    if (this.isAvatarUpdated()) {
      return `data:image/${this.file.fileExtension};base64,${this.file.fileContent}`
    } else {
      const id = this.authService.getLoginData().fileId as string
      return `${environment.backEndBaseUrl}:${environment.port}/files/${id}`
    }
  }

  isUnreadNotification() {
    return this.notificationCount > 0;
  }

  getNotificationValue() {
    return this.notificationCount;
  }

  toNotificationMenu() {
    this.router.navigateByUrl('notification');
  }

  incrementCount(value: number) {
    this.notificationCount += value;
  }
}
