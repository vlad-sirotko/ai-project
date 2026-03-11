import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SupportedLanguageModel } from '../../shared/models/supported-language.model';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/languages';

  getActiveLanguages(): Observable<SupportedLanguageModel[]> {
    return this.http.get<SupportedLanguageModel[]>(this.baseUrl);
  }
}
