import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { AdminService } from '../../../core/services/admin.service';
import { LanguageStore } from '../../../core/stores/language.store';
import { LanguageDto } from '../../../shared/models/language.model';
import { AdminLanguagesFacade } from './admin-languages.facade';

describe('AdminLanguagesFacade', () => {
  let facade: AdminLanguagesFacade;
  let mockAdminService: { getLanguages: jest.Mock; toggleLanguage: jest.Mock; addLanguage: jest.Mock };
  let mockLanguageStore: { refreshLanguages: jest.Mock };

  const sampleLanguages: LanguageDto[] = [
    { id: 'lang-1', code: 'en', name: 'English', isActive: true, isDefaultSource: true, isDefaultTarget: false },
    { id: 'lang-2', code: 'pl', name: 'Polish', isActive: true, isDefaultSource: false, isDefaultTarget: true },
  ];

  const toggledLang: LanguageDto = { ...sampleLanguages[1], isActive: false };

  beforeEach(() => {
    mockAdminService = {
      getLanguages: jest.fn().mockReturnValue(of(sampleLanguages)),
      toggleLanguage: jest.fn().mockReturnValue(of(toggledLang)),
      addLanguage: jest.fn().mockReturnValue(of({ id: 'lang-3', code: 'de', name: 'German', isActive: true, isDefaultSource: false, isDefaultTarget: false })),
    };

    mockLanguageStore = {
      refreshLanguages: jest.fn().mockResolvedValue(undefined),
    };

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        AdminLanguagesFacade,
        { provide: AdminService, useValue: mockAdminService },
        { provide: LanguageStore, useValue: mockLanguageStore },
      ],
    });

    facade = TestBed.inject(AdminLanguagesFacade);
  });

  it('should call LanguageStore is NOT involved in loadLanguages() — AdminService.getLanguages() is called', async () => {
    await facade.loadLanguages();
    expect(mockAdminService.getLanguages).toHaveBeenCalled();
    expect(facade.languages()).toEqual(sampleLanguages);
  });

  it('should call AdminService.toggleLanguage() with the correct id on toggleLanguage()', async () => {
    await facade.loadLanguages();
    await facade.toggleLanguage('lang-2');
    expect(mockAdminService.toggleLanguage).toHaveBeenCalledWith('lang-2');
  });

  it('should update the local languages list after toggleLanguage() succeeds', async () => {
    await facade.loadLanguages();
    await facade.toggleLanguage('lang-2');
    const updated = facade.languages().find(l => l.id === 'lang-2');
    expect(updated?.isActive).toBe(false);
  });

  it('should refresh LanguageStore after toggleLanguage() succeeds', async () => {
    await facade.loadLanguages();
    await facade.toggleLanguage('lang-2');
    expect(mockLanguageStore.refreshLanguages).toHaveBeenCalled();
  });

  it('should call AdminService.addLanguage() and update the list on success', async () => {
    await facade.addLanguage('de', 'German');
    expect(mockAdminService.addLanguage).toHaveBeenCalledWith('de', 'German');
    expect(facade.languages().some(l => l.code === 'de')).toBe(true);
  });

  it('should refresh LanguageStore after addLanguage() succeeds', async () => {
    await facade.addLanguage('de', 'German');
    expect(mockLanguageStore.refreshLanguages).toHaveBeenCalled();
  });

  it('should set addError and return false when addLanguage() fails', async () => {
    mockAdminService.addLanguage.mockReturnValue(throwError(() => new Error('Duplicate code')));
    const result = await facade.addLanguage('en', 'English');
    expect(result).toBe(false);
    expect(facade.addError()).toBe('Duplicate code');
  });
});
