import { computed, inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { LanguageService } from '../services/language.service';
import { SupportedLanguageModel } from '../../shared/models/supported-language.model';

@Injectable({ providedIn: 'root' })
export class LanguageStore {
  private readonly languageService = inject(LanguageService);

  private readonly _languages = signal<SupportedLanguageModel[]>([]);
  private readonly _isLoading = signal(false);

  readonly languages = this._languages.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly activeLanguages = computed(() =>
    this._languages().filter((lang) => lang.isActive)
  );

  async loadLanguages(): Promise<void> {
    if (this._languages().length > 0) return;
    await this.fetchLanguages();
  }

  async refreshLanguages(): Promise<void> {
    await this.fetchLanguages();
  }

  private async fetchLanguages(): Promise<void> {
    this._isLoading.set(true);
    try {
      const languages = await firstValueFrom(this.languageService.getActiveLanguages());
      this._languages.set(languages);
    } finally {
      this._isLoading.set(false);
    }
  }
}
