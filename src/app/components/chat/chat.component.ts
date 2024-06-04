import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { WebSocketService } from '../../services/websocket/websocket.service';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { AuthService } from '../../services/auth/auth.service';
import { ClientAssignmentResDto } from '../../dto/client-assignment/client-assignment.res.dto';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { UserService } from '../../services/user/user.service';
import { UserResDto } from '../../dto/user/user.res.dto';
import { ClientAssignmentService } from '../../services/client-assignment/client-assignment.service';
import { RoleType } from '../../constants/roles.constant';
import { ChatMessageDto } from '../../dto/chat/chat-message.dto';
import { FormatTimestampPipe } from '../../utils/formatTimestamp.pipe';
import { ChatService } from '../../services/chat/chat.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ButtonModule,
    ToastModule,
    InputTextModule,
    FloatLabelModule,
    FormatTimestampPipe,
  ],
  providers: [MessageService],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  @ViewChild('messagesContainer') messagesContainer: ElementRef | undefined;

  text = '';
  receivedMessages: ChatMessageDto[] = [];
  sentMessages: ChatMessageDto[] = [];
  assignment: ClientAssignmentResDto | undefined;
  clientId = '';
  sender: UserResDto | undefined;
  recipient: UserResDto | undefined;

  isClient = this.authService.getLoginData().roleCode === RoleType.CLIENT;
  connected = false;

  constructor(
    private websocketService: WebSocketService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private clientAssignmentService: ClientAssignmentService,
    private chatService: ChatService,
    private location: Location,
  ) { }

  async ngOnInit(): Promise<void> {
    const params = await firstValueFrom(this.activatedRoute.params);
    this.clientId = params['id'];
    this.websocketService.connect(this.clientId);

    this.websocketService.onMessage().subscribe(message => {
      this.receivedMessages.push(message);
      this.scrollToBottom();
    });

    try {
      this.assignment = await firstValueFrom(this.clientAssignmentService.getClientAssignmentByClientId(this.clientId));
      if (this.assignment) {
        const userIds = this.isClient ? [this.assignment.clientId, this.assignment.psId] : [this.assignment.psId, this.assignment.clientId];
        this.sender = await this.fetchUser(userIds[0]);
        this.recipient = await this.fetchUser(userIds[1]);
      }

      const allMessages = await firstValueFrom(this.chatService.loadMessage(this.clientId));
      this.receivedMessages = allMessages;
      this.scrollToBottom();
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async fetchUser(userId: string): Promise<UserResDto | undefined> {
    try {
      return await firstValueFrom(this.userService.getUserById(userId));
    } catch (error) {
      console.error('Error fetching user:', error);
      return undefined;
    }
  }

  get allMessages(): ChatMessageDto[] {
    return [...this.receivedMessages, ...this.sentMessages]
  }

  sendMessage(): void {
    if (this.assignment && this.text.trim()) {
      const message: ChatMessageDto = {
        recipientId: this.isClient ? this.assignment.psId : this.assignment.clientId,
        senderId: !this.isClient ? this.assignment.psId : this.assignment.clientId,
        message: this.text,
        timestamp: new Date().toISOString(),
      };
      this.websocketService.sendMessage(this.assignment.clientId, message);
      this.chatService.sendMessage(message);
      this.text = '';
      this.scrollToBottom();
    }
  }

  scrollToBottom(): void {
    setTimeout(() => {
      const container = this.messagesContainer?.nativeElement;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 100);
  }

  onBack() {
    this.location.back()
  }
}
