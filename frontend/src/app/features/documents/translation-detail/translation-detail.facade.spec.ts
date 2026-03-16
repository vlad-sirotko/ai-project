import { provideZonelessChangeDetection, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { DocumentService } from '../../../core/services/document.service';
import { LanguageStore } from '../../../core/stores/language.store';
import { TranslationStore } from '../../../core/stores/translation.store';
import { DocumentModel } from '../../../shared/models/document.model';
import { SupportedLanguageModel } from '../../../shared/models/supported-language.model';
import { TranslationDetailFacade } from './translation-detail.facade';

describe('TranslationDetailFacade', () => {
  let facade: TranslationDetailFacade;
  let selectedDocSignal: ReturnType<typeof signal<DocumentModel | null>>;
  let allLanguagesSignal: ReturnType<typeof signal<SupportedLanguageModel[]>>;
  let activeLanguagesSignal: ReturnType<typeof signal<SupportedLanguageModel[]>>;
  let mockDocumentService: { getDocument: jest.Mock; addTranslation: jest.Mock };
  let mockTranslationStore: {
    selectedDocument: () => DocumentModel | null;
    setSelectedDocument: jest.Mock;
  };
  let mockLanguageStore: {
    languages: () => SupportedLanguageModel[];
    activeLanguages: () => SupportedLanguageModel[];
    loadLanguages: jest.Mock;
  };

  const ruLang: SupportedLanguageModel = { id: 3, code: 'ru', name: 'Russian', isActive: true, isDefaultSource: false, isDefaultTarget: false };
  const plLang: SupportedLanguageModel = { id: 2, code: 'pl', name: 'Polish', isActive: true, isDefaultSource: false, isDefaultTarget: true };

  const sampleDoc: DocumentModel = {
    id: 'doc-1',
    originalFileName: 'file.pdf',
    sourceLanguage: 'en',
    fileSizeBytes: 2048,
    uploadedAt: '2024-01-01T00:00:00Z',
    jobs: [
      { id: 'job-1', targetLanguage: 'pl', status: 'Completed', translatedText: 'Polish text', errorMessage: null, createdAt: '', completedAt: '' },
    ],
  };

  beforeEach(() => {
    selectedDocSignal = signal<DocumentModel | null>(null);
    allLanguagesSignal = signal<SupportedLanguageModel[]>([ruLang, plLang]);
    activeLanguagesSignal = signal<SupportedLanguageModel[]>([ruLang, plLang]);

    mockDocumentService = {
      getDocument: jest.fn().mockReturnValue(of(sampleDoc)),
      addTranslation: jest.fn().mockReturnValue(of({ id: 'job-2', targetLanguage: 'ru', status: 'Pending', translatedText: null, errorMessage: null, createdAt: '', completedAt: null })),
    };

    mockTranslationStore = {
      selectedDocument: selectedDocSignal,
      setSelectedDocument: jest.fn((doc: DocumentModel | null) => selectedDocSignal.set(doc)),
    };

    mockLanguageStore = {
      languages: allLanguagesSignal,
      activeLanguages: activeLanguagesSignal,
      loadLanguages: jest.fn().mockResolvedValue(undefined),
    };

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        TranslationDetailFacade,
        { provide: DocumentService, useValue: mockDocumentService },
        { provide: TranslationStore, useValue: mockTranslationStore },
        { provide: LanguageStore, useValue: mockLanguageStore },
      ],
    });

    facade = TestBed.inject(TranslationDetailFacade);
  });

  it('should return all active languages when no document is selected (availableLanguages)', () => {
    selectedDocSignal.set(null);
    expect(facade.availableLanguages()).toEqual([ruLang, plLang]);
  });

  it('should filter out languages already used in the document (availableLanguages)', () => {
    selectedDocSignal.set(sampleDoc); // sampleDoc has 'pl' job
    // only Russian should remain available
    expect(facade.availableLanguages()).toEqual([ruLang]);
  });

  it('should update the selected job signal when selectJob() is called', () => {
    selectedDocSignal.set(sampleDoc);
    facade.selectJob('job-1');
    expect(facade.selectedJobId()).toBe('job-1');
    expect(facade.selectedJob()?.id).toBe('job-1');
  });

  it('should return early and NOT call DocumentService when addLanguage() is called with no documentId', () => {
    // facade.currentDocumentId is null — no loadDocument() called
    facade.addLanguage('ru');
    expect(mockDocumentService.addTranslation).not.toHaveBeenCalled();
  });

  it('should call DocumentService.addTranslation() when addLanguage() is called with a valid documentId', () => {
    facade.loadDocument('doc-1');
    facade.addLanguage('ru');
    expect(mockDocumentService.addTranslation).toHaveBeenCalledWith('doc-1', 'ru');
  });
});
