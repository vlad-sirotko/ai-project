import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthResponse } from '../../shared/models/auth-response.model';
import { UserModel } from '../../shared/models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/auth';

  register(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/register`, { email, password });
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, { email, password });
  }

  getMe(): Observable<UserModel> {
    return this.http.get<UserModel>(`${this.baseUrl}/me`);
  }

  updatePreferences(preferredTargetLanguage: string): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/me/preferences`, { preferredTargetLanguage });
  }
}
