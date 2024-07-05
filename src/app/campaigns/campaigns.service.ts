import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Campaign } from './campaign.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CampaignsService {
  // private apiUrl = 'http://localhost:5000/campaigns';
  private apiUrl = environment.apiUrl + 'campaigns';

  constructor(private http: HttpClient) {}

  getCampaigns(): Observable<Campaign[]> {
    return this.http.get<Campaign[]>(this.apiUrl);
  }

  createCampaign(campaign: Campaign): Observable<Campaign> {
    return this.http.post<Campaign>(this.apiUrl, campaign);
  }

  updateCampaign(id: number, campaign: Partial<Campaign>): Observable<Campaign> {
    return this.http.patch<Campaign>(`${this.apiUrl}/${id}`, campaign);
  }

  deleteCampaign(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  filterCampaigns(startDate: string, endDate: string): Observable<Campaign[]> {
    return this.http.get<Campaign[]>(`${this.apiUrl}/filter?startDate=${startDate}&endDate=${endDate}`);
  }
}
