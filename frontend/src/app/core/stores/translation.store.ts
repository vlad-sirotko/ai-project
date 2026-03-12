import { Injectable, signal } from '@angular/core';

import { DocumentModel } from '../../shared/models/document.model';

@Injectable({ providedIn: 'root' })
export class TranslationStore {
  private readonly _documents = signal<DocumentModel[]>([]);
  private readonly _selectedDocument = signal<DocumentModel | null>(null);

  readonly documents = this._documents.asReadonly();
  readonly selectedDocument = this._selectedDocument.asReadonly();

  setDocuments(docs: DocumentModel[]): void {
    this._documents.set(docs);
  }

  setSelectedDocument(doc: DocumentModel | null): void {
    this._selectedDocument.set(doc);
  }
}
