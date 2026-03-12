import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { UploadResponseModel } from '../../shared/models/upload-response.model';
import { DocumentModel } from '../../shared/models/document.model';
import { TranslationJobModel } from '../../shared/models/translation-job.model';

@Injectable({ providedIn: 'root' })
export class DocumentService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/documents';

  upload(file: File, sourceLang: string, targetLang: string): Observable<UploadResponseModel> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('sourceLang', sourceLang);
    formData.append('targetLang', targetLang);
    return this.http.post<UploadResponseModel>(`${this.baseUrl}/upload`, formData);
  }

  getDocuments(): Observable<DocumentModel[]> {
    return this.http.get<DocumentModel[]>(this.baseUrl);
  }

  getDocument(id: string): Observable<DocumentModel> {
    return this.http.get<DocumentModel>(`${this.baseUrl}/${id}`);
  }

  addTranslation(documentId: string, targetLang: string): Observable<TranslationJobModel> {
    return this.http.post<TranslationJobModel>(`${this.baseUrl}/${documentId}/translate`, { targetLanguage: targetLang });
  }
}
