import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { AuthStore } from '../../../core/stores/auth.store';
import { DocumentService } from '../../../core/services/document.service';

const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024;

@Injectable()
export class UploadFacade {
  private readonly authStore = inject(AuthStore);
  private readonly documentService = inject(DocumentService);
  private readonly router = inject(Router);

  private readonly _selectedFile = signal<File | null>(null);
  private readonly _sourceLang = signal<string>('');
  private readonly _targetLang = signal<string>(this.authStore.preferredTargetLanguage() ?? '');
  private readonly _isLoading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly selectedFile = this._selectedFile.asReadonly();
  readonly sourceLang = this._sourceLang.asReadonly();
  readonly targetLang = this._targetLang.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly fileTooLargeWarning = computed(() => {
    const file = this._selectedFile();
    return file !== null && file.size > MAX_FILE_SIZE_BYTES;
  });

  readonly validationErrors = computed(() => {
    const errors: Record<string, string> = {};
    const file = this._selectedFile();

    if (file === null) {
      errors['file'] = 'Please select a file.';
    } else if (!file.name.toLowerCase().endsWith('.pdf')) {
      errors['file'] = 'Only PDF files are accepted.';
    }

    if (!this._sourceLang()) {
      errors['sourceLang'] = 'Please select a source language.';
    }

    if (!this._targetLang()) {
      errors['targetLang'] = 'Please select a target language.';
    }

    if (
      this._sourceLang() &&
      this._targetLang() &&
      this._sourceLang() === this._targetLang()
    ) {
      errors['languages'] = 'Source and target languages must be different.';
    }

    return errors;
  });

  readonly isValid = computed(() => Object.keys(this.validationErrors()).length === 0);

  setFile(file: File): void {
    this._selectedFile.set(file);
    this._error.set(null);
  }

  setSourceLang(code: string): void {
    this._sourceLang.set(code);
  }

  setTargetLang(code: string): void {
    this._targetLang.set(code);
  }

  async submit(): Promise<void> {
    if (!this.isValid()) return;

    this._isLoading.set(true);
    this._error.set(null);

    try {
      const response = await firstValueFrom(
        this.documentService.upload(
          this._selectedFile()!,
          this._sourceLang(),
          this._targetLang(),
        )
      );
      await this.router.navigate(['/app/translations', response.documentId]);
    } catch (err) {
      const message =
        err instanceof HttpErrorResponse
          ? (err.error?.message ?? err.error?.title ?? 'Upload failed. Please try again.')
          : 'Upload failed. Please try again.';
      this._error.set(message);
    } finally {
      this._isLoading.set(false);
    }
  }
}
