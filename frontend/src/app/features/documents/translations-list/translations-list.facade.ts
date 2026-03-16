import { DestroyRef, inject, Injectable, Signal, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EMPTY, interval, Subject } from 'rxjs';
import { catchError, switchMap, takeUntil } from 'rxjs/operators';

import { DocumentService } from '../../../core/services/document.service';
import { LanguageStore } from '../../../core/stores/language.store';
import { TranslationStore } from '../../../core/stores/translation.store';
import { DocumentModel } from '../../../shared/models/document.model';
import { SupportedLanguageModel } from '../../../shared/models/supported-language.model';
import { JobStatus } from '../../../shared/models/translation-job.model';

@Injectable()
export class TranslationsListFacade {
  private readonly documentService = inject(DocumentService);
  private readonly translationStore = inject(TranslationStore);
  private readonly languageStore = inject(LanguageStore);
  private readonly destroyRef = inject(DestroyRef);

  private readonly stopPolling$ = new Subject<void>();
  private readonly _retrying = signal<string[]>([]);

  readonly documents: Signal<DocumentModel[]> = this.translationStore.documents;
  readonly activeLanguages: Signal<SupportedLanguageModel[]> = this.languageStore.activeLanguages;

  loadDocuments(): void {
    this.languageStore.loadLanguages();
    this.documentService.getDocuments().subscribe(docs => {
      this.translationStore.setDocuments(docs);
      if (this.hasActiveJobs(docs)) {
        this.startPolling();
      }
    });
  }

  addLanguage(documentId: string, targetLang: string): void {
    this.documentService.addTranslation(documentId, targetLang).pipe(
      catchError(err => {
        console.error('Failed to add language:', err);
        return EMPTY;
      }),
    ).subscribe(() => this.loadDocuments());
  }

  retry(documentId: string, targetLang: string): void {
    const key = `${documentId}:${targetLang}`;
    this._retrying.update(keys => [...keys, key]);
    this.documentService.addTranslation(documentId, targetLang).pipe(
      catchError(err => {
        console.error('Failed to retry translation:', err);
        this._retrying.update(keys => keys.filter(k => k !== key));
        return EMPTY;
      }),
    ).subscribe(() => {
      this._retrying.update(keys => keys.filter(k => k !== key));
      this.loadDocuments();
    });
  }

  isRetrying(documentId: string, targetLang: string): boolean {
    return this._retrying().includes(`${documentId}:${targetLang}`);
  }

  isAlreadyAdded(doc: DocumentModel, langCode: string): boolean {
    return doc.jobs.some(j => j.targetLanguage === langCode);
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
