import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ImageModule } from 'primeng/image';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ImageModule,
    ButtonModule,
    InputTextModule,
    RippleModule,
  ],
  templateUrl: `./forbidden.component.html`,
  styleUrls: ['./forbidden.component.css'],

})
export class ForbiddenComponent {}
