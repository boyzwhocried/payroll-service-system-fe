import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { PrimeIcons } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { NotificationService } from '../../services/notification/notification.service';
import { firstValueFrom } from 'rxjs';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';

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
  styleUrl: './navbar.component.css'
})

export class NavbarComponent {
  allItem: MenuItem[] | undefined
  saItem: MenuItem[] | undefined
  clientItem: MenuItem[] | undefined
  psItem: MenuItem[] | undefined
  notificationItem: MenuItem[] | undefined
  notificationCount: number = 0
  userItem: MenuItem[] | undefined

  constructor(
    private notificationService: NotificationService,
    private router: Router
  ) { }

  ngOnInit() {
    this.init();
  }

  init() {
    firstValueFrom(this.notificationService.getNotificationCount()).then(
      response => {
        console.log(response)
        this.notificationCount = response
      }
    )

    this.userItem = [
      {
        label: 'Profile',
        route: '/profile',
        icon: PrimeIcons.USER,
      },
      {
        label: 'Change Password',
        route: '/change-password',
        icon: PrimeIcons.LOCK,
      },
      {
        separator: true,
      },
      {
        label: 'Logout',
        route: '/logout',
        icon: PrimeIcons.SIGN_OUT,
      }
    ]

    this.allItem = [
      {
        label: 'Users',
        icon: PrimeIcons.USERS,
        items: [
          {
            label: 'List',
            route: '/users',
            icon: PrimeIcons.LIST,
          },
          {
            label: 'Create',
            route: '/users/new',
            icon: PrimeIcons.PLUS,
          },
        ]
      },
      {
        label: 'Companies',
        icon: PrimeIcons.BUILDING,
        route: '/companies'
      },
      {
        label: 'Assign',
        route: '/assign',
        icon: PrimeIcons.BOOK,
      },
      {
        label: 'Schedule',
        route: '/schedule',
        icon: PrimeIcons.CALENDAR_CLOCK,
      },
      {
        label: 'Chat',
        route: '/chat',
        icon: PrimeIcons.COMMENTS,
      },
      {
        label: 'Schedules',
        route: '/schedules',
        icon: PrimeIcons.CALENDAR_CLOCK,
      },
      { separator: true },
      this.notificationItem = [
        {
          icon: PrimeIcons.BELL,
          route: '/notification'
        }
      ],
      this.userItem
    ]

    this.saItem = [
      {
        label: 'Users',
        icon: PrimeIcons.USERS,
        items: [
          {
            label: 'List',
            route: '/users',
            icon: PrimeIcons.LIST,
          },
          {
            label: 'Create',
            route: '/users/new',
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
            route: '/companies',
            icon: PrimeIcons.LIST,
          },
          {
            label: 'Create',
            route: '/companies/new',
            icon: PrimeIcons.PLUS,
          },
        ]
      },
      {
        label: 'Assign',
        route: '/assign',
        icon: PrimeIcons.BOOK,
      },
      { separator: true },
      this.userItem
    ];

    this.clientItem = [
      {
        label: 'Schedule',
        route: '/schedule',
        icon: PrimeIcons.CALENDAR_CLOCK,
      },
      {
        label: 'Chat',
        route: '/chat',
        icon: PrimeIcons.COMMENTS,
      },
      { separator: true },
      this.userItem
    ];


    this.psItem = [
      {
        label: 'Schedules',
        route: '/schedules',
        icon: PrimeIcons.CALENDAR_CLOCK,
      },
      { separator: true },
      this.userItem
    ]

  }

  isUnreadNotification() {
    return this.notificationCount > 0
  }

  getNotificationValue() {
    return this.notificationCount
  }

  toNotificationMenu() {
    this.router.navigateByUrl('notification')
  }

}
