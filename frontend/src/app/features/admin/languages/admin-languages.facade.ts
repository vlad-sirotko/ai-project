import { inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { AdminService } from '../../../core/services/admin.service';
import { LanguageStore } from '../../../core/stores/language.store';
import { LanguageDto } from '../../../shared/models/language.model';

@Injectable()
export class AdminLanguagesFacade {
  private readonly adminService = inject(AdminService);
  private readonly languageStore = inject(LanguageStore);

  private readonly _languages = signal<LanguageDto[]>([]);
  private readonly _isLoading = signal(false);
  private readonly _addError = signal<string | null>(null);

  readonly languages = this._languages.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly addError = this._addError.asReadonly();

  async loadLanguages(): Promise<void> {
    this._isLoading.set(true);
    try {
      const langs = await firstValueFrom(this.adminService.getLanguages());
      this._languages.set(langs);
    } finally {
      this._isLoading.set(false);
    }
  }

  async toggleLanguage(id: string): Promise<void> {
    this._isLoading.set(true);
    try {
      const updated = await firstValueFrom(this.adminService.toggleLanguage(id));
      this._languages.update((langs) =>
        langs.map((l) => (l.id === updated.id ? updated : l))
      );
      await this.languageStore.refreshLanguages();
    } finally {
      this._isLoading.set(false);
    }
  }

  async addLanguage(code: string, name: string): Promise<boolean> {
    this._isLoading.set(true);
    this._addError.set(null);
    try {
      const created = await firstValueFrom(this.adminService.addLanguage(code, name));
      this._languages.update((langs) => [...langs, created]);
      return true;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to add language.';
      this._addError.set(message);
      return false;
    } finally {
      this._isLoading.set(false);
    }
  }
}
