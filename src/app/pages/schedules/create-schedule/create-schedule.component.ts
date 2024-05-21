import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';


@Component({
  selector: 'app-create-schedule',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './create-schedule.component.html',
  styleUrl: './create-schedule.component.css'
})
export class CreateScheduleComponent {

}
