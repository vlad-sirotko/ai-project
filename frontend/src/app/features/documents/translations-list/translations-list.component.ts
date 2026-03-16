import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';

import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { FileSizePipe } from '../../../shared/pipes/file-size.pipe';
import { TranslationsListFacade } from './translations-list.facade';

@Component({
  selector: 'app-translations-list',
  standalone: true,
  imports: [RouterLink, DatePipe, MatMenuModule, StatusBadgeComponent, FileSizePipe],
  templateUrl: './translations-list.component.html',
  styleUrl: './translations-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TranslationsListFacade],
})
export class TranslationsListComponent implements OnInit {
  protected readonly facade = inject(TranslationsListFacade);

  ngOnInit(): void {
    this.facade.loadDocuments();
  }
}
