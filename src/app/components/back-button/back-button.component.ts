import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-back-button',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
  ],
  templateUrl: './back-button.component.html',
  styleUrl: './back-button.component.css'
})
export class BackButtonComponent {

  constructor(
    private location: Location
  ) { }

  onBack() {
    this.location.back()
  }

}
