import { DestroyRef, inject, Injectable, Signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

import { DocumentService } from '../../../core/services/document.service';
import { TranslationStore } from '../../../core/stores/translation.store';
import { DocumentModel } from '../../../shared/models/document.model';
import { JobStatus } from '../../../shared/models/translation-job.model';

@Injectable()
export class TranslationDetailFacade {
  private readonly documentService = inject(DocumentService);
  private readonly translationStore = inject(TranslationStore);
  private readonly destroyRef = inject(DestroyRef);

  private readonly stopPolling$ = new Subject<void>();

  readonly document: Signal<DocumentModel | null> = this.translationStore.selectedDocument;

  loadDocument(documentId: string): void {
    this.documentService.getDocument(documentId).subscribe(doc => {
      this.translationStore.setSelectedDocument(doc);
      if (this.hasActiveJobs(doc)) {
        this.startPolling(documentId);
      }
    });
  }

  private startPolling(documentId: string): void {
    interval(3000).pipe(
      takeUntil(this.stopPolling$),
      takeUntilDestroyed(this.destroyRef),
      switchMap(() => this.documentService.getDocument(documentId)),
    ).subscribe(doc => {
      this.translationStore.setSelectedDocument(doc);
      if (!this.hasActiveJobs(doc)) {
        this.stopPolling$.next();
      }
    });
  }

  private hasActiveJobs(doc: DocumentModel): boolean {
    const active: JobStatus[] = ['Pending', 'Processing'];
    return doc.jobs.some(j => active.includes(j.status));
  }
}
