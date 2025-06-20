import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private currentUserSubject = new BehaviorSubject<any | null>(
    this.getPersistedUser(),
  );
  public currentUser = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  public get currentUserValue(): any | null {
    return this.currentUserSubject.value;
  }

  private getPersistedUser(): any | null {
    const user = localStorage.getItem('currentUser'); // Key as string
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }

  getUserRole(): string | null {
    return this.currentUserValue ? this.currentUserValue.role : null;
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        if (response && response.user) {
          localStorage.setItem('currentUser', JSON.stringify(response.user)); // Key as string
          this.currentUserSubject.next(response.user);
        }
      }),
    );
  }

  signup(userInfo: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, userInfo);
  }

  logout(): void {
    localStorage.removeItem('currentUser'); // Key as string
    this.currentUserSubject.next(null);
    // Optionally navigate to login or home page via Router if service has access
  }
}
