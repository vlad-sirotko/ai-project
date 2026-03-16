import { provideZonelessChangeDetection, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AuthStore } from '../../../core/stores/auth.store';
import { DocumentService } from '../../../core/services/document.service';
import { LanguageStore } from '../../../core/stores/language.store';
import { SupportedLanguageModel } from '../../../shared/models/supported-language.model';
import { UploadFacade } from './upload.facade';

describe('UploadFacade', () => {
  let facade: UploadFacade;
  let mockDocumentService: { upload: jest.Mock };
  let mockRouter: { navigate: jest.Mock };
  let defaultSourceSignal: ReturnType<typeof signal<SupportedLanguageModel | null>>;
  let defaultTargetSignal: ReturnType<typeof signal<SupportedLanguageModel | null>>;
  let preferredTargetSignal: ReturnType<typeof signal<string>>;

  const enLang: SupportedLanguageModel = {
    id: 1, code: 'en', name: 'English', isActive: true, isDefaultSource: true, isDefaultTarget: false,
  };
  const plLang: SupportedLanguageModel = {
    id: 2, code: 'pl', name: 'Polish', isActive: true, isDefaultSource: false, isDefaultTarget: true,
  };

  beforeEach(() => {
    defaultSourceSignal = signal<SupportedLanguageModel | null>(enLang);
    defaultTargetSignal = signal<SupportedLanguageModel | null>(plLang);
    preferredTargetSignal = signal<string>('');

    const mockLanguageStore = {
      defaultSourceLanguage: defaultSourceSignal,
      defaultTargetLanguage: defaultTargetSignal,
    };

    const mockAuthStore = {
      preferredTargetLanguage: preferredTargetSignal,
    };

    mockDocumentService = {
      upload: jest.fn().mockReturnValue(of({ documentId: 'doc-1' })),
    };

    mockRouter = { navigate: jest.fn().mockResolvedValue(true) };

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        UploadFacade,
        { provide: AuthStore, useValue: mockAuthStore },
        { provide: DocumentService, useValue: mockDocumentService },
        { provide: LanguageStore, useValue: mockLanguageStore },
        { provide: Router, useValue: mockRouter },
      ],
    });

    facade = TestBed.inject(UploadFacade);
    TestBed.flushEffects();
  });

  it('should have no validation errors when a valid PDF file and languages are selected', () => {
    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    facade.setFile(file);
    // sourceLang + targetLang are pre-set by effect from defaults (en + pl)
    expect(Object.keys(facade.validationErrors())).toHaveLength(0);
  });

  it('should have a file validation error when no file is selected', () => {
    // no file set yet
    expect(facade.validationErrors()['file']).toBeTruthy();
  });

  it('should have a targetLang error when no target language is selected', () => {
    defaultTargetSignal.set(null);
    // create facade fresh so effect runs without a default target
    TestBed.resetTestingModule();
    const mockLanguageStore2 = {
      defaultSourceLanguage: signal<SupportedLanguageModel | null>(enLang),
      defaultTargetLanguage: signal<SupportedLanguageModel | null>(null),
    };
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        UploadFacade,
        { provide: AuthStore, useValue: { preferredTargetLanguage: signal('') } },
        { provide: DocumentService, useValue: mockDocumentService },
        { provide: LanguageStore, useValue: mockLanguageStore2 },
        { provide: Router, useValue: mockRouter },
      ],
    });
    const freshFacade = TestBed.inject(UploadFacade);
    // File is also missing, ensure targetLang error is present
    expect(freshFacade.validationErrors()['targetLang']).toBeTruthy();
  });

  it('should return fileTooLargeWarning = false for a file within 20 MB', () => {
    const file = new File([new Uint8Array(1024)], 'small.pdf', { type: 'application/pdf' });
    facade.setFile(file);
    expect(facade.fileTooLargeWarning()).toBe(false);
  });

  it('should return fileTooLargeWarning = true for a file exceeding 20 MB', () => {
    const largeSizeBytes = 21 * 1024 * 1024;
    const file = { name: 'large.pdf', size: largeSizeBytes, type: 'application/pdf' } as File;
    facade.setFile(file);
    expect(facade.fileTooLargeWarning()).toBe(true);
  });

  it('should call DocumentService.upload() when submit() is called with valid state', async () => {
    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    facade.setFile(file);
    await facade.submit();
    expect(mockDocumentService.upload).toHaveBeenCalled();
  });

  it('should navigate to /app/translations/:id on successful upload', async () => {
    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    facade.setFile(file);
    await facade.submit();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/app/translations', 'doc-1']);
  });

  it('should set error signal when upload fails', async () => {
    mockDocumentService.upload.mockReturnValue(throwError(() => new Error('Network error')));
    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    facade.setFile(file);
    await facade.submit();
    expect(facade.error()).toBeTruthy();
  });
});
