import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AppSettingDto } from '../../shared/models/app-setting.model';
import { LanguageDto } from '../../shared/models/language.model';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly http = inject(HttpClient);

  getSettings(): Observable<AppSettingDto[]> {
    return this.http.get<AppSettingDto[]>('/api/admin/settings');
  }

  updateSettings(settings: Record<string, string>): Observable<void> {
    return this.http.put<void>('/api/admin/settings', { settings });
  }

  getLanguages(): Observable<LanguageDto[]> {
    return this.http.get<LanguageDto[]>('/api/admin/languages');
  }

  addLanguage(code: string, name: string): Observable<LanguageDto> {
    return this.http.post<LanguageDto>('/api/admin/languages', { code, name });
  }

  toggleLanguage(id: string): Observable<LanguageDto> {
    return this.http.put<LanguageDto>(`/api/admin/languages/${id}`, {});
  }
}
