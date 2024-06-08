import { Injectable } from '@angular/core';
import { environment } from '../../../env/environment';
import * as Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import { Subject, Observable } from 'rxjs';
import { ChatMessageDto } from '../../dto/chat/chat-message.dto';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private wsClient: any;
  private connectedSubject = new Subject<boolean>();
  private messageSubject = new Subject<ChatMessageDto>();
  private received: ChatMessageDto[] = [];
  connected$ = this.connectedSubject.asObservable();

  public readonly url = `${environment.backEndBaseUrl}:${environment.port}/livechat`;
  public readonly topicMessage = '/send/livechat/';
  public readonly topicChat = '/send/livechat/';

  constructor(private datePipe: DatePipe) { }

  connect(clientId: string): void {
    if (this.wsClient && this.wsClient.connected) {
      return;
    }
    const ws = new SockJS(this.url);
    this.wsClient = Stomp.over(ws);
    this.received = [];
    this.wsClient.connect({}, () => {
      this.wsClient.subscribe(this.topicMessage + clientId, (message: { body: any }) => {
        const newMessage: ChatMessageDto = JSON.parse(message.body);
        newMessage.timestamp = this.formatDate(newMessage.timestamp);
        if (!this.received.some(msg => msg.timestamp === newMessage.timestamp && msg.message === newMessage.message && msg.senderId === newMessage.senderId)) {
          this.received.push(newMessage);
          this.messageSubject.next(newMessage);
        }
      });
      this.connectedSubject.next(true);
    });
  }

  disconnect(): void {
    if (this.wsClient) {
      this.wsClient.disconnect(() => {
        console.log('Disconnected from WebSocket');
        this.connectedSubject.next(false);
      });
    }
  }

  sendMessage(clientId: string, chatMessage: ChatMessageDto): void {
    this.wsClient.send(this.topicChat + clientId, {}, JSON.stringify(chatMessage));
  }

  onMessage(): Observable<ChatMessageDto> {
    return this.messageSubject.asObservable();
  }

  private formatDate(date: string): string {
    const parsedDate = new Date(date);
    const dateCreated = parsedDate.toISOString()
    const created = this.datePipe.transform(dateCreated, 'yyyy-MM-ddTHH:mm');
    return created!;
  }
}
