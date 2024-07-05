import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from './message.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  // private apiUrl = 'http://localhost:5000/messages';
  private apiUrl = environment.apiUrl + 'messages';

  constructor(private http: HttpClient) {}

  sendMessagesForCampaign(message: {text:string,campaign_id:number,process_date:string,process_hour:string}): Observable<Message> {
    return this.http.post<Message>(`${this.apiUrl}/send`, message);
  }

  updateMessageStatus(id: number, status: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/status/${status}`, {});
  }

  findMessagesByCampaign(campaignId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/campaign/${campaignId}`);
  }

  getMessages(): Observable<Message[]> {
    return this.http.get<Message[]>(this.apiUrl);
  }
}
