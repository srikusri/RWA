import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ComplaintService {
  private apiUrl = 'http://localhost:3000/api/complaints';

  constructor(private http: HttpClient) {}

  getComplaints(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  submitComplaint(complaintData: any): Observable<any> {
    return this.http.post(this.apiUrl, complaintData);
  }

  updateComplaintStatus(
    id: number,
    statusInfo: { status: string },
  ): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, statusInfo);
  }
}
