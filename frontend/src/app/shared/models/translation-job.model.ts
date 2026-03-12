export type JobStatus = 'Pending' | 'Processing' | 'Completed' | 'Failed';

export interface TranslationJobModel {
  id: string;
  targetLanguage: string;
  status: JobStatus;
  translatedText: string | null;
  errorMessage: string | null;
  createdAt: string;
  completedAt: string | null;
}
