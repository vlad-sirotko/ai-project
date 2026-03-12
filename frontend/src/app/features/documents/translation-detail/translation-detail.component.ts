import { ChangeDetectionStrategy, Component, inject, input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';

import { TranslationDetailFacade } from './translation-detail.facade';
import { TranslationJobModel } from '../../../shared/models/translation-job.model';
import { LanguageStore } from '../../../core/stores/language.store';

@Component({
  selector: 'app-translation-detail',
  standalone: true,
  imports: [RouterLink, DatePipe, MatTabsModule],
  templateUrl: './translation-detail.component.html',
  styleUrl: './translation-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TranslationDetailFacade],
})
export class TranslationDetailComponent implements OnInit {
  protected readonly facade = inject(TranslationDetailFacade);
  private readonly languageStore = inject(LanguageStore);

  readonly id = input.required<string>();

  ngOnInit(): void {
    this.facade.loadDocument(this.id());
    this.languageStore.loadLanguages();
  }

  protected getLanguageName(code: string): string {
    const lang = this.languageStore.languages().find(l => l.code === code);
    return lang?.name ?? code.toUpperCase();
  }

  protected flagEmoji(langCode: string): string {
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
    return map[langCode.toLowerCase()] ?? '🌐';
  }

  protected statusIcon(job: TranslationJobModel): string {
    switch (job.status) {
      case 'Completed': return '●';
      case 'Processing':
      case 'Pending': return '⟳';
      case 'Failed': return '✕';
    }
  }

  protected onTabChange(index: number): void {
    const doc = this.facade.document();
    if (doc && doc.jobs[index]) {
      this.facade.selectJob(doc.jobs[index].id);
    }
  }

  protected get selectedTabIndex(): number {
    const doc = this.facade.document();
    const selectedId = this.facade.selectedJobId();
    if (!doc || !selectedId) return 0;
    const idx = doc.jobs.findIndex(j => j.id === selectedId);
    return idx >= 0 ? idx : 0;
  }
}
