import { Injectable } from '@angular/core';
import { ChatMessageDto } from '../../dto/chat/chat-message.dto';
import { InsertResDto } from '../../dto/general-response/insert.res.dto';
import { BaseService } from '../base/base.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private baseService: BaseService) { }

  sendMessage(message: ChatMessageDto) {
    return this.baseService.postWithoutHandler<InsertResDto>(`chat/`, message)
      .subscribe();
  }

  loadMessage(id: string) {
    return this.baseService.get<ChatMessageDto[]>(`chat/${id}`)
  }
}
