import { computed, DestroyRef, inject, Injectable, signal, Signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

import { DocumentService } from '../../../core/services/document.service';
import { LanguageStore } from '../../../core/stores/language.store';
import { TranslationStore } from '../../../core/stores/translation.store';
import { DocumentModel } from '../../../shared/models/document.model';
import { SupportedLanguageModel } from '../../../shared/models/supported-language.model';
import { JobStatus, TranslationJobModel } from '../../../shared/models/translation-job.model';

@Injectable()
export class TranslationDetailFacade {
  private readonly documentService = inject(DocumentService);
  private readonly translationStore = inject(TranslationStore);
  private readonly languageStore = inject(LanguageStore);
  private readonly destroyRef = inject(DestroyRef);

  private readonly stopPolling$ = new Subject<void>();
  private currentDocumentId: string | null = null;

  // ── Selected document (from store) ──────────────────────────────────────────
  readonly document: Signal<DocumentModel | null> = this.translationStore.selectedDocument;

  // ── Languages ────────────────────────────────────────────────────────────────
  readonly languages = this.languageStore.languages;

  readonly availableLanguages = computed<SupportedLanguageModel[]>(() => {
    const doc = this.document();
    const all = this.languageStore.activeLanguages();
    if (!doc) return all;
    const usedCodes = new Set(doc.jobs.map(j => j.targetLanguage.toLowerCase()));
    return all.filter(l => !usedCodes.has(l.code.toLowerCase()));
  });

  // ── Selected job ─────────────────────────────────────────────────────────────
  private readonly _selectedJobId = signal<string | null>(null);
  readonly selectedJobId = this._selectedJobId.asReadonly();

  readonly selectedJob = computed<TranslationJobModel | null>(() => {
    const doc = this.document();
    const id = this._selectedJobId();
    if (!doc || !id) return null;
    return doc.jobs.find(j => j.id === id) ?? null;
  });

  selectJob(id: string): void {
    this._selectedJobId.set(id);
  }

  // ── Copy text ────────────────────────────────────────────────────────────────
  private readonly _copyTextCopied = signal(false);
  readonly copyTextCopied = this._copyTextCopied.asReadonly();

  copyText(): void {
    const text = this.selectedJob()?.translatedText ?? '';
    navigator.clipboard.writeText(text).then(() => {
      this._copyTextCopied.set(true);
      setTimeout(() => this._copyTextCopied.set(false), 2000);
    });
  }

  // ── Error signals ────────────────────────────────────────────────────────────
  private readonly _addLanguageError = signal<string | null>(null);
  readonly addLanguageError = this._addLanguageError.asReadonly();

  private readonly _retryError = signal<string | null>(null);
  readonly retryError = this._retryError.asReadonly();

  // ── Load ─────────────────────────────────────────────────────────────────────
  loadDocument(documentId: string): void {
    this.currentDocumentId = documentId;
    this.languageStore.loadLanguages();
    this.documentService.getDocument(documentId).subscribe(doc => {
      this.translationStore.setSelectedDocument(doc);
      if (doc.jobs.length > 0 && !this._selectedJobId()) {
        this._selectedJobId.set(doc.jobs[0].id);
      }
      if (this.hasActiveJobs(doc)) {
        this.startPolling(documentId);
      }
    });
  }

  // ── Add language ─────────────────────────────────────────────────────────────
  addLanguage(targetLang: string): void {
    if (!this.currentDocumentId) return;
    this._addLanguageError.set(null);
    this.documentService.addTranslation(this.currentDocumentId, targetLang).subscribe({
      next: newJob => this.refreshAfterMutation(newJob.id),
      error: () => this._addLanguageError.set('Failed to add language. Please try again.'),
    });
  }

  // ── Retry translation ────────────────────────────────────────────────────────
  retryTranslation(targetLang: string): void {
    if (!this.currentDocumentId) return;
    this._retryError.set(null);
    this.documentService.addTranslation(this.currentDocumentId, targetLang).subscribe({
      next: newJob => this.refreshAfterMutation(newJob.id),
      error: () => this._retryError.set('Failed to retry translation. Please try again.'),
    });
  }

  // ── Polling ──────────────────────────────────────────────────────────────────
  private refreshAfterMutation(selectJobId?: string): void {
    if (!this.currentDocumentId) return;
    this.stopPolling$.next();
    this.documentService.getDocument(this.currentDocumentId).subscribe(doc => {
      this.translationStore.setSelectedDocument(doc);
      if (selectJobId) {
        this._selectedJobId.set(selectJobId);
      }
      if (this.hasActiveJobs(doc)) {
        this.startPolling(this.currentDocumentId!);
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
