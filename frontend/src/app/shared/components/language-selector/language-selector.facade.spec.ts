import { provideZonelessChangeDetection, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { LanguageStore } from '../../../core/stores/language.store';
import { SupportedLanguageModel } from '../../models/supported-language.model';
import { LanguageSelectorFacade } from './language-selector.facade';

describe('LanguageSelectorFacade', () => {
  let facade: LanguageSelectorFacade;
  let activeLanguagesSignal: ReturnType<typeof signal<SupportedLanguageModel[]>>;
  let isLoadingSignal: ReturnType<typeof signal<boolean>>;
  let mockLanguageStore: {
    activeLanguages: () => SupportedLanguageModel[];
    isLoading: () => boolean;
    loadLanguages: jest.Mock;
  };

  const sampleLanguages: SupportedLanguageModel[] = [
    { id: 1, code: 'en', name: 'English', isActive: true, isDefaultSource: true, isDefaultTarget: false },
    { id: 2, code: 'pl', name: 'Polish', isActive: true, isDefaultSource: false, isDefaultTarget: false },
  ];

  beforeEach(() => {
    activeLanguagesSignal = signal<SupportedLanguageModel[]>([]);
    isLoadingSignal = signal(false);

    mockLanguageStore = {
      activeLanguages: activeLanguagesSignal,
      isLoading: isLoadingSignal,
      loadLanguages: jest.fn().mockResolvedValue(undefined),
    };

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        LanguageSelectorFacade,
        { provide: LanguageStore, useValue: mockLanguageStore },
      ],
    });

    facade = TestBed.inject(LanguageSelectorFacade);
  });

  it('should expose the same languages as the mocked store', () => {
    activeLanguagesSignal.set(sampleLanguages);
    expect(facade.activeLanguages()).toEqual(sampleLanguages);
  });

  it('should call LanguageStore.loadLanguages() when loadLanguages() is invoked', async () => {
    await facade.loadLanguages();
    expect(mockLanguageStore.loadLanguages).toHaveBeenCalled();
  });
});
