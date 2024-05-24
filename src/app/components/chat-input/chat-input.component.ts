import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-chat-input',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
  ],
  templateUrl: './chat-input.component.html',
  styleUrl: './chat-input.component.css'
})
export class ChatInputComponent {
  message: string = '';
  @Output() sendMessage = new EventEmitter<{ user: string, text: string }>();

  emitMessage() {
    if (this.message.trim()) {
      this.sendMessage.emit({ user: 'User', text: this.message });
      this.message = '';
    }
  }
}
