import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../env/environment.prod';
import { Chat } from '../../dto/chat/chat.dto';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  getSupabaseClient() {
    return this.supabase;
  }

  async getAllChats() {
    return this.supabase.from('t_r_chat').select('*');
  }

  async postChat(chat: Chat) {
    return this.supabase.from('t_r_chat').insert([{
      message: chat.message,
      recipient_id: chat.recipientId // Adjust to match your table column name
    }]);
  }

  subscribeToNewChats(callback: (payload: any) => void) {
    this.supabase
      .channel('public:t_r_chat')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 't_r_chat' }, callback)
      .subscribe();
  }
}
