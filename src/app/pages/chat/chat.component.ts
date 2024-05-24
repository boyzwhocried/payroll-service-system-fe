import { Component } from '@angular/core';
import { ChatInputComponent } from "../../components/chat-input/chat-input.component";
import { ChatWindowComponent } from "../../components/chat-window/chat-window.component";
import { SupabaseService } from '../../services/supabase/supabase.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Chat } from '../../dto/chat/chat.dto';

@Component({
  selector: 'app-chat',
  standalone: true,
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
  imports: [ChatInputComponent, ChatWindowComponent, CommonModule, FormsModule]
})
export class ChatComponent {
  messages: Chat[] = [];
  newMessage: string = '';

  constructor(private supabaseService: SupabaseService) {}

  async ngOnInit() {
    const { data, error } = await this.supabaseService.getAllChats();
    if (data) {
      this.messages = data;
    }

    this.supabaseService.subscribeToNewChats((payload) => {
      this.messages.push(payload.new);
    });
  }

  async sendMessage() {
    const message: Chat = {
      message: this.newMessage,
      recipientId: '1' // Replace with actual recipient ID logic, ensure this is a string
    };
    const { error } = await this.supabaseService.postChat(message);
    if (!error) {
      this.newMessage = '';
    }
  }
}
