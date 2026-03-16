import { provideZonelessChangeDetection, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { DocumentService } from '../../../core/services/document.service';
import { LanguageStore } from '../../../core/stores/language.store';
import { TranslationStore } from '../../../core/stores/translation.store';
import { DocumentModel } from '../../../shared/models/document.model';
import { SupportedLanguageModel } from '../../../shared/models/supported-language.model';
import { TranslationsListFacade } from './translations-list.facade';

describe('TranslationsListFacade', () => {
  let facade: TranslationsListFacade;
  let docsSignal: ReturnType<typeof signal<DocumentModel[]>>;
  let activeLanguagesSignal: ReturnType<typeof signal<SupportedLanguageModel[]>>;
  let mockDocumentService: { getDocuments: jest.Mock; addTranslation: jest.Mock };
  let mockTranslationStore: { documents: () => DocumentModel[]; setDocuments: jest.Mock };
  let mockLanguageStore: {
    activeLanguages: () => SupportedLanguageModel[];
    loadLanguages: jest.Mock;
  };

  const sampleDoc: DocumentModel = {
    id: 'doc-1',
    originalFileName: 'file.pdf',
    sourceLanguage: 'en',
    fileSizeBytes: 1024,
    uploadedAt: '2024-01-01T00:00:00Z',
    jobs: [{ id: 'job-1', targetLanguage: 'pl', status: 'Completed', translatedText: 'text', errorMessage: null, createdAt: '', completedAt: '' }],
  };

  beforeEach(() => {
    docsSignal = signal<DocumentModel[]>([]);
    activeLanguagesSignal = signal<SupportedLanguageModel[]>([]);

    mockDocumentService = {
      getDocuments: jest.fn().mockReturnValue(of([sampleDoc])),
      addTranslation: jest.fn().mockReturnValue(of({ id: 'job-2', targetLanguage: 'ru', status: 'Pending', translatedText: null, errorMessage: null, createdAt: '', completedAt: null })),
    };

    mockTranslationStore = {
      documents: docsSignal,
      setDocuments: jest.fn((docs: DocumentModel[]) => docsSignal.set(docs)),
    };

    mockLanguageStore = {
      activeLanguages: activeLanguagesSignal,
      loadLanguages: jest.fn().mockResolvedValue(undefined),
    };

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        TranslationsListFacade,
        { provide: DocumentService, useValue: mockDocumentService },
        { provide: TranslationStore, useValue: mockTranslationStore },
        { provide: LanguageStore, useValue: mockLanguageStore },
      ],
    });

    facade = TestBed.inject(TranslationsListFacade);
  });

  it('should call DocumentService.getDocuments() and populate the store on loadDocuments()', () => {
    facade.loadDocuments();
    expect(mockDocumentService.getDocuments).toHaveBeenCalled();
    expect(mockTranslationStore.setDocuments).toHaveBeenCalledWith([sampleDoc]);
  });

  it('should expose documents from the TranslationStore signal', () => {
    docsSignal.set([sampleDoc]);
    expect(facade.documents()).toEqual([sampleDoc]);
  });

  it('should expose activeLanguages from the LanguageStore signal', () => {
    const langs: SupportedLanguageModel[] = [
      { id: 1, code: 'en', name: 'English', isActive: true, isDefaultSource: true, isDefaultTarget: false },
    ];
    activeLanguagesSignal.set(langs);
    expect(facade.activeLanguages()).toEqual(langs);
  });

  it('should not throw when the component is destroyed (destroyRef teardown)', () => {
    expect(() => TestBed.resetTestingModule()).not.toThrow();
  });
});
