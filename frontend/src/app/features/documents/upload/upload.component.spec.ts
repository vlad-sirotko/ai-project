import { provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { UploadComponent } from './upload.component';
import { UploadFacade } from './upload.facade';

describe('UploadComponent', () => {
  let fixture: ComponentFixture<UploadComponent>;
  let component: UploadComponent;

  let validationErrorsSignal: ReturnType<typeof signal<Record<string, string>>>;
  let isLoadingSignal: ReturnType<typeof signal<boolean>>;
  let isValidSignal: ReturnType<typeof signal<boolean>>;
  let fileTooLargeSignal: ReturnType<typeof signal<boolean>>;
  let errorSignal: ReturnType<typeof signal<string | null>>;

  let mockFacade: {
    validationErrors: () => Record<string, string>;
    isLoading: () => boolean;
    isValid: () => boolean;
    fileTooLargeWarning: () => boolean;
    error: () => string | null;
    submit: jest.Mock;
    setFile: jest.Mock;
    clearFile: jest.Mock;
    sourceLang: () => string;
    targetLang: () => string;
    setSourceLang: jest.Mock;
    setTargetLang: jest.Mock;
  };

  beforeEach(async () => {
    validationErrorsSignal = signal<Record<string, string>>({});
    isLoadingSignal = signal(false);
    isValidSignal = signal(true);
    fileTooLargeSignal = signal(false);
    errorSignal = signal<string | null>(null);

    mockFacade = {
      validationErrors: validationErrorsSignal,
      isLoading: isLoadingSignal,
      isValid: isValidSignal,
      fileTooLargeWarning: fileTooLargeSignal,
      error: errorSignal,
      submit: jest.fn().mockResolvedValue(undefined),
      setFile: jest.fn(),
      clearFile: jest.fn(),
      sourceLang: signal('en'),
      targetLang: signal('pl'),
      setSourceLang: jest.fn(),
      setTargetLang: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [UploadComponent],
      providers: [provideZonelessChangeDetection(), provideHttpClient(), provideHttpClientTesting()],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(UploadComponent, {
        set: { providers: [{ provide: UploadFacade, useValue: mockFacade }] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(UploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render a file validation error when validationErrors contains a "file" key', () => {
    validationErrorsSignal.set({ file: 'Please select a file.' });
    fixture.detectChanges();

    const errors = fixture.debugElement.queryAll(By.css('.upload-form__error'));
    const texts = errors.map(e => e.nativeElement.textContent.trim());
    expect(texts).toContain('Please select a file.');
  });

  it('should disable the submit button when isLoading is true', () => {
    isLoadingSignal.set(true);
    isValidSignal.set(true);
    fixture.detectChanges();

    const btn = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(btn.nativeElement.disabled).toBe(true);
  });

  it('should disable the submit button when isValid is false', () => {
    isValidSignal.set(false);
    isLoadingSignal.set(false);
    fixture.detectChanges();

    const btn = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(btn.nativeElement.disabled).toBe(true);
  });

  it('should call facade.submit() when the form is submitted', () => {
    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('ngSubmit', null);
    expect(mockFacade.submit).toHaveBeenCalled();
  });

  it('should show the file-too-large warning when fileTooLargeWarning is true', () => {
    fileTooLargeSignal.set(true);
    fixture.detectChanges();

    const warning = fixture.debugElement.query(By.css('.upload-form__warning'));
    expect(warning).toBeTruthy();
    expect(warning.nativeElement.textContent).toContain('20 MB');
  });
});
