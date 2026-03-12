import { ChangeDetectionStrategy, Component, inject, input, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { TranslationDetailFacade } from './translation-detail.facade';
import { TranslationJobModel } from '../../../shared/models/translation-job.model';

@Component({
  selector: 'app-translation-detail',
  standalone: true,
  imports: [RouterLink, DatePipe, MatTabsModule, MatProgressBarModule],
  templateUrl: './translation-detail.component.html',
  styleUrl: './translation-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TranslationDetailFacade],
})
export class TranslationDetailComponent implements OnInit {
  protected readonly facade = inject(TranslationDetailFacade);

  readonly id = input.required<string>();

  protected readonly showAddLanguage = signal(false);

  ngOnInit(): void {
    this.facade.loadDocument(this.id());
  }

  protected getLanguageName(code: string): string {
    const lang = this.facade.languages().find(l => l.code === code);
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

  protected toggleAddLanguage(): void {
    this.showAddLanguage.update(v => !v);
  }

  protected onAddLanguage(langCode: string): void {
    this.facade.addLanguage(langCode);
    this.showAddLanguage.set(false);
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
