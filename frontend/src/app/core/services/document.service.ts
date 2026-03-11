import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { UploadResponseModel } from '../../shared/models/upload-response.model';

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
}
