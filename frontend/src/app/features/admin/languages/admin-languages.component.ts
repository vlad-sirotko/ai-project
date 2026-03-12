import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AdminLanguagesFacade } from './admin-languages.facade';

@Component({
  selector: 'app-admin-languages',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-languages.component.html',
  styleUrl: './admin-languages.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AdminLanguagesFacade],
})
export class AdminLanguagesComponent implements OnInit {
  protected readonly facade = inject(AdminLanguagesFacade);

  protected readonly showAddForm = signal(false);
  protected newCode = '';
  protected newName = '';

  ngOnInit(): void {
    this.facade.loadLanguages();
  }

  protected toggleAddForm(): void {
    this.showAddForm.update((v) => !v);
    if (!this.showAddForm()) {
      this.resetForm();
    }
  }

  protected cancelAddForm(): void {
    this.showAddForm.set(false);
    this.resetForm();
  }

  protected async onAddSubmit(): Promise<void> {
    const success = await this.facade.addLanguage(this.newCode.trim(), this.newName.trim());
    if (success) {
      this.showAddForm.set(false);
      this.resetForm();
    }
  }

  protected flagEmoji(code: string): string {
    const map: Record<string, string> = {
      en: '🇬🇧',
      ru: '🇷🇺',
      pl: '🇵🇱',
      de: '🇩🇪',
      fr: '🇫🇷',
      es: '🇪🇸',
      it: '🇮🇹',
      pt: '🇵🇹',
      zh: '🇨🇳',
      ja: '🇯🇵',
      ko: '🇰🇷',
      ar: '🇸🇦',
      tr: '🇹🇷',
      nl: '🇳🇱',
      sv: '🇸🇪',
      uk: '🇺🇦',
    };
    return map[code.toLowerCase()] ?? '🌐';
  }

  private resetForm(): void {
    this.newCode = '';
    this.newName = '';
  }
}
