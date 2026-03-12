import { inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { AdminService } from '../../../core/services/admin.service';

export interface SettingsViewModel {
  translationProvider: string;
  deeplApiKey: string;
  deeplFreeApi: boolean;
}

export type ConnectionStatus = 'connected' | 'invalid' | 'mock' | 'idle';

export interface ConnectionStatusState {
  status: ConnectionStatus;
  charsRemaining?: number;
}

@Injectable()
export class AdminSettingsFacade {
  private readonly adminService = inject(AdminService);

  private readonly _settings = signal<SettingsViewModel | null>(null);
  private readonly _isLoading = signal(false);
  private readonly _saveError = signal<string | null>(null);
  private readonly _connectionStatus = signal<ConnectionStatusState>({ status: 'idle' });

  readonly settings = this._settings.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly saveError = this._saveError.asReadonly();
  readonly connectionStatus = this._connectionStatus.asReadonly();

  async loadSettings(): Promise<void> {
    this._isLoading.set(true);
    this._saveError.set(null);
    try {
      const dtos = await firstValueFrom(this.adminService.getSettings());
      this._settings.set(this.mapToViewModel(dtos));
    } catch {
      this._saveError.set('Failed to load settings.');
    } finally {
      this._isLoading.set(false);
    }
  }

  async saveSettings(values: SettingsViewModel): Promise<void> {
    this._isLoading.set(true);
    this._saveError.set(null);
    try {
      const payload: Record<string, string> = {
        TranslationProvider: values.translationProvider,
        DeepLApiKey: values.deeplApiKey,
        DeepLFreeApi: values.deeplFreeApi.toString(),
      };
      await firstValueFrom(this.adminService.updateSettings(payload));
      this._settings.set({ ...values });
      this.updateConnectionStatus(values);
    } catch {
      this._saveError.set('Failed to save settings.');
    } finally {
      this._isLoading.set(false);
    }
  }

  private updateConnectionStatus(values: SettingsViewModel): void {
    if (values.translationProvider === 'Mock') {
      this._connectionStatus.set({ status: 'mock' });
      return;
    }
    if (values.deeplApiKey?.trim()) {
      this._connectionStatus.set({ status: 'connected' });
    } else {
      this._connectionStatus.set({ status: 'invalid' });
    }
  }

  private mapToViewModel(dtos: { key: string; value: string }[]): SettingsViewModel {
    const map = Object.fromEntries(dtos.map((d) => [d.key, d.value]));
    return {
      translationProvider: map['TranslationProvider'] ?? 'Mock',
      deeplApiKey: map['DeepLApiKey'] ?? '',
      deeplFreeApi: map['DeepLFreeApi']?.toLowerCase() === 'true',
    };
  }
}
