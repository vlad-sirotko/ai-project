import { DestroyRef, inject, Injectable, Signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

import { DocumentService } from '../../../core/services/document.service';
import { TranslationStore } from '../../../core/stores/translation.store';
import { DocumentModel } from '../../../shared/models/document.model';
import { JobStatus } from '../../../shared/models/translation-job.model';

@Injectable()
export class TranslationsListFacade {
  private readonly documentService = inject(DocumentService);
  private readonly translationStore = inject(TranslationStore);
  private readonly destroyRef = inject(DestroyRef);

  private readonly stopPolling$ = new Subject<void>();

  readonly documents: Signal<DocumentModel[]> = this.translationStore.documents;

  loadDocuments(): void {
    this.documentService.getDocuments().subscribe(docs => {
      this.translationStore.setDocuments(docs);
      if (this.hasActiveJobs(docs)) {
        this.startPolling();
      }
    });
  }

  private startPolling(): void {
    interval(5000).pipe(
      takeUntil(this.stopPolling$),
      takeUntilDestroyed(this.destroyRef),
      switchMap(() => this.documentService.getDocuments()),
    ).subscribe(docs => {
      this.translationStore.setDocuments(docs);
      if (!this.hasActiveJobs(docs)) {
        this.stopPolling$.next();
      }
    });
  }

  private hasActiveJobs(docs: DocumentModel[]): boolean {
    const active: JobStatus[] = ['Pending', 'Processing'];
    return docs.some(doc => doc.jobs.some(j => active.includes(j.status)));
  }
}
