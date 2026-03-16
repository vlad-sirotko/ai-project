import { provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { AdminSettingsComponent } from './admin-settings.component';
import { AdminSettingsFacade, ConnectionStatusState, SettingsViewModel } from './admin-settings.facade';

describe('AdminSettingsComponent', () => {
  let fixture: ComponentFixture<AdminSettingsComponent>;
  let component: AdminSettingsComponent;

  let settingsSignal: ReturnType<typeof signal<SettingsViewModel | null>>;
  let isLoadingSignal: ReturnType<typeof signal<boolean>>;
  let saveErrorSignal: ReturnType<typeof signal<string | null>>;
  let connectionStatusSignal: ReturnType<typeof signal<ConnectionStatusState>>;

  let mockFacade: {
    settings: () => SettingsViewModel | null;
    isLoading: () => boolean;
    saveError: () => string | null;
    connectionStatus: () => ConnectionStatusState;
    loadSettings: jest.Mock;
    saveSettings: jest.Mock;
  };

  const loadedSettings: SettingsViewModel = {
    translationProvider: 'Mock',
    deeplApiKey: '',
    deeplFreeApi: false,
  };

  beforeEach(async () => {
    settingsSignal = signal<SettingsViewModel | null>(null);
    isLoadingSignal = signal(false);
    saveErrorSignal = signal<string | null>(null);
    connectionStatusSignal = signal<ConnectionStatusState>({ status: 'idle' });

    mockFacade = {
      settings: settingsSignal,
      isLoading: isLoadingSignal,
      saveError: saveErrorSignal,
      connectionStatus: connectionStatusSignal,
      loadSettings: jest.fn().mockResolvedValue(undefined),
      saveSettings: jest.fn().mockResolvedValue(undefined),
    };

    // Make loadSettings set the settings signal like the real facade would
    mockFacade.loadSettings.mockImplementation(async () => {
      settingsSignal.set(loadedSettings);
    });

    await TestBed.configureTestingModule({
      imports: [AdminSettingsComponent],
      providers: [provideZonelessChangeDetection()],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(AdminSettingsComponent, {
        set: { providers: [{ provide: AdminSettingsFacade, useValue: mockFacade }] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(AdminSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should render the settings form when settings signal has a value', () => {
    const form = fixture.debugElement.query(By.css('.settings-form'));
    expect(form).toBeTruthy();
  });

  it('should call facade.saveSettings() with draft values when onSave() is called', () => {
    component['onSave']();
    expect(mockFacade.saveSettings).toHaveBeenCalledWith(component['draft']());
  });

  it('should disable the save button when isLoading is true', () => {
    isLoadingSignal.set(true);
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('button.save-btn'));
    expect(btn.nativeElement.disabled).toBe(true);
  });

  it('should show a success status indicator when connectionStatus is "mock"', () => {
    connectionStatusSignal.set({ status: 'mock' });
    fixture.detectChanges();
    const statusEl = fixture.debugElement.query(By.css('.status--mock'));
    expect(statusEl).toBeTruthy();
  });

  it('should show an error status indicator when connectionStatus is "invalid"', () => {
    connectionStatusSignal.set({ status: 'invalid' });
    fixture.detectChanges();
    const statusEl = fixture.debugElement.query(By.css('.status--invalid'));
    expect(statusEl).toBeTruthy();
  });

  it('should show a save error when saveError signal has a value', () => {
    saveErrorSignal.set('Failed to save settings.');
    fixture.detectChanges();
    const errorEl = fixture.debugElement.query(By.css('.error'));
    expect(errorEl).toBeTruthy();
    expect(errorEl.nativeElement.textContent.trim()).toBe('Failed to save settings.');
  });
});
