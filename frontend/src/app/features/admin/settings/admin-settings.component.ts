import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AdminSettingsFacade, SettingsViewModel } from './admin-settings.facade';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-settings.component.html',
  styleUrl: './admin-settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AdminSettingsFacade],
})
export class AdminSettingsComponent implements OnInit {
  protected readonly facade = inject(AdminSettingsFacade);
  protected showApiKey = false;
  protected readonly draft = signal<SettingsViewModel>({
    translationProvider: 'Mock',
    deeplApiKey: '',
    deeplFreeApi: false,
  });

  ngOnInit(): void {
    this.facade.loadSettings().then(() => {
      const loaded = this.facade.settings();
      if (loaded) this.draft.set({ ...loaded });
    });
  }

  protected onProviderChange(provider: string): void {
    this.draft.update((d) => ({ ...d, translationProvider: provider }));
  }

  protected onApiKeyChange(key: string): void {
    this.draft.update((d) => ({ ...d, deeplApiKey: key }));
  }

  protected onFreeApiChange(value: boolean): void {
    this.draft.update((d) => ({ ...d, deeplFreeApi: value }));
  }

  protected onSave(): void {
    this.facade.saveSettings(this.draft());
  }
}
