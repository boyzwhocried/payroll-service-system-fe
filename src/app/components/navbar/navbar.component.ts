import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { PrimeIcons } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    MenubarModule,
    RouterModule,
    AvatarModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  allItems: MenuItem[] | undefined;
  SAItems: MenuItem[] | undefined;
  clientItems: MenuItem[] | undefined;
  PSItems: MenuItem[] | undefined;
  profileItem: MenuItem = {
    label: 'Profile',
    icon: PrimeIcons.USER,
    items: [
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
      },
    ]
  }

  constructor() { }

  ngOnInit() {
    this.allItems = [
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
      this.profileItem
    ]

    this.SAItems = [
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
      this.profileItem
    ];

    this.clientItems = [
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
      this.profileItem
    ];


    this.PSItems = [
      {
        label: 'Schedules',
        route: '/schedules',
        icon: PrimeIcons.CALENDAR_CLOCK,
      },
      { separator: true },
      this.profileItem
    ]
  }
}
