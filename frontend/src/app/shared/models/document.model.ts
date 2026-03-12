import { TranslationJobModel } from './translation-job.model';

export interface DocumentModel {
  id: string;
  originalFileName: string;
  sourceLanguage: string;
  fileSizeBytes: number;
  uploadedAt: string;
  jobs: TranslationJobModel[];
}
