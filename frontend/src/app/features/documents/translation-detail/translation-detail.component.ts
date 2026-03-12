import { ChangeDetectionStrategy, Component, inject, input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { TranslationDetailFacade } from './translation-detail.facade';

@Component({
  selector: 'app-translation-detail',
  standalone: true,
  imports: [RouterLink, DatePipe, StatusBadgeComponent],
  templateUrl: './translation-detail.component.html',
  styleUrl: './translation-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TranslationDetailFacade],
})
export class TranslationDetailComponent implements OnInit {
  protected readonly facade = inject(TranslationDetailFacade);

  readonly id = input.required<string>();

  ngOnInit(): void {
    this.facade.loadDocument(this.id());
  }
}
