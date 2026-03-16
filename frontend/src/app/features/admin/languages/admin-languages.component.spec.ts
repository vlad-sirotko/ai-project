import { provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { AdminLanguagesComponent } from './admin-languages.component';
import { AdminLanguagesFacade } from './admin-languages.facade';
import { LanguageDto } from '../../../shared/models/language.model';

describe('AdminLanguagesComponent', () => {
  let fixture: ComponentFixture<AdminLanguagesComponent>;

  let languagesSignal: ReturnType<typeof signal<LanguageDto[]>>;
  let isLoadingSignal: ReturnType<typeof signal<boolean>>;
  let addErrorSignal: ReturnType<typeof signal<string | null>>;

  let mockFacade: {
    languages: () => LanguageDto[];
    isLoading: () => boolean;
    addError: () => string | null;
    loadLanguages: jest.Mock;
    toggleLanguage: jest.Mock;
    addLanguage: jest.Mock;
  };

  const sampleLanguages: LanguageDto[] = [
    { id: 'lang-1', code: 'en', name: 'English', isActive: true, isDefaultSource: true, isDefaultTarget: false },
    { id: 'lang-2', code: 'pl', name: 'Polish', isActive: true, isDefaultSource: false, isDefaultTarget: false },
  ];

  beforeEach(async () => {
    languagesSignal = signal<LanguageDto[]>([]);
    isLoadingSignal = signal(false);
    addErrorSignal = signal<string | null>(null);

    mockFacade = {
      languages: languagesSignal,
      isLoading: isLoadingSignal,
      addError: addErrorSignal,
      loadLanguages: jest.fn().mockResolvedValue(undefined),
      toggleLanguage: jest.fn().mockResolvedValue(undefined),
      addLanguage: jest.fn().mockResolvedValue(true),
    };

    await TestBed.configureTestingModule({
      imports: [AdminLanguagesComponent],
      providers: [provideZonelessChangeDetection()],
    })
      .overrideComponent(AdminLanguagesComponent, {
        set: { providers: [{ provide: AdminLanguagesFacade, useValue: mockFacade }] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(AdminLanguagesComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should render a table row for each language in the facade signal', () => {
    languagesSignal.set(sampleLanguages);
    fixture.detectChanges();
    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows).toHaveLength(2);
  });

  it('should call facade.toggleLanguage(id) with the correct id when the toggle button is clicked', () => {
    // Use a non-English language so the toggle button is rendered (en is excluded in template)
    languagesSignal.set([sampleLanguages[1]]);
    fixture.detectChanges();

    const toggleBtn = fixture.debugElement.query(By.css('.toggle-btn'));
    toggleBtn.nativeElement.click();

    expect(mockFacade.toggleLanguage).toHaveBeenCalledWith('lang-2');
  });

  it('should call facade.addLanguage() when the add-language form is submitted', async () => {
    // Open the add form
    const addBtn = fixture.debugElement.query(By.css('.add-btn'));
    addBtn.nativeElement.click();
    fixture.detectChanges();

    // Fill in values via component properties
    const comp = fixture.componentInstance as AdminLanguagesComponent;
    (comp as unknown as { newCode: string }).newCode = 'de';
    (comp as unknown as { newName: string }).newName = 'German';
    fixture.detectChanges();

    await (comp as unknown as { onAddSubmit: () => Promise<void> }).onAddSubmit();

    expect(mockFacade.addLanguage).toHaveBeenCalledWith('de', 'German');
  });

  it('should show an empty table body when languages list is empty', () => {
    languagesSignal.set([]);
    fixture.detectChanges();
    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows).toHaveLength(0);
  });
});
