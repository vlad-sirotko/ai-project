import { computed, inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { UserModel } from '../../shared/models/user.model';

export const AUTH_TOKEN_KEY = 'auth_token';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly authService = inject(AuthService);

  private readonly _currentUser = signal<UserModel | null>(null);
  private readonly _preferredTargetLanguage = signal<string>('');

  readonly currentUser = this._currentUser.asReadonly();
  readonly preferredTargetLanguage = this._preferredTargetLanguage.asReadonly();
  readonly isAuthenticated = computed(() => this._currentUser() !== null);
  readonly isAdmin = computed(() => this._currentUser()?.role === 'Admin');

  constructor() {
    this.restoreSession();
  }

  async login(email: string, password: string): Promise<void> {
    const response = await firstValueFrom(this.authService.login(email, password));
    localStorage.setItem(AUTH_TOKEN_KEY, response.token);
    this._currentUser.set({
      id: response.userId,
      email: response.email,
      role: response.role,
      preferredTargetLanguage: response.preferredTargetLanguage,
    });
    this._preferredTargetLanguage.set(response.preferredTargetLanguage ?? '');
  }

  async register(email: string, password: string): Promise<void> {
    const response = await firstValueFrom(this.authService.register(email, password));
    localStorage.setItem(AUTH_TOKEN_KEY, response.token);
    this._currentUser.set({
      id: response.userId,
      email: response.email,
      role: response.role,
      preferredTargetLanguage: response.preferredTargetLanguage,
    });
    this._preferredTargetLanguage.set(response.preferredTargetLanguage ?? '');
  }

  logout(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    this._currentUser.set(null);
    this._preferredTargetLanguage.set('');
  }

  async updatePreferences(language: string): Promise<void> {
    await firstValueFrom(this.authService.updatePreferences(language));
    this._preferredTargetLanguage.set(language);
    const user = this._currentUser();
    if (user) {
      this._currentUser.set({ ...user, preferredTargetLanguage: language });
    }
  }

  getToken(): string | null {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }

  private async restoreSession(): Promise<void> {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) return;
    try {
      const user = await firstValueFrom(this.authService.getMe());
      this._currentUser.set(user);
      this._preferredTargetLanguage.set(user.preferredTargetLanguage ?? '');
    } catch {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  }
}
