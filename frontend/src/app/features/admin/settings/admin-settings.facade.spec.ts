import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { AdminService } from '../../../core/services/admin.service';
import { AdminSettingsFacade } from './admin-settings.facade';

describe('AdminSettingsFacade', () => {
  let facade: AdminSettingsFacade;
  let mockAdminService: { getSettings: jest.Mock; updateSettings: jest.Mock };

  const settingsDtos = [
    { key: 'TranslationProvider', value: 'Mock' },
    { key: 'DeepLApiKey', value: 'my-key' },
    { key: 'DeepLFreeApi', value: 'false' },
  ];

  beforeEach(() => {
    mockAdminService = {
      getSettings: jest.fn().mockReturnValue(of(settingsDtos)),
      updateSettings: jest.fn().mockReturnValue(of(undefined)),
    };

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        AdminSettingsFacade,
        { provide: AdminService, useValue: mockAdminService },
      ],
    });

    facade = TestBed.inject(AdminSettingsFacade);
  });

  it('should call AdminService.getSettings() and populate the settings signal on loadSettings()', async () => {
    await facade.loadSettings();
    expect(mockAdminService.getSettings).toHaveBeenCalled();
    expect(facade.settings()).toEqual({
      translationProvider: 'Mock',
      deeplApiKey: 'my-key',
      deeplFreeApi: false,
    });
  });

  it('should call AdminService.updateSettings() with the correct payload on saveSettings()', async () => {
    await facade.saveSettings({ translationProvider: 'DeepL', deeplApiKey: 'key-123', deeplFreeApi: true });
    expect(mockAdminService.updateSettings).toHaveBeenCalledWith({
      TranslationProvider: 'DeepL',
      DeepLApiKey: 'key-123',
      DeepLFreeApi: 'true',
    });
  });

  it('should set connectionStatus to "mock" when provider is Mock after save', async () => {
    await facade.saveSettings({ translationProvider: 'Mock', deeplApiKey: '', deeplFreeApi: false });
    expect(facade.connectionStatus().status).toBe('mock');
  });

  it('should set connectionStatus to "connected" when provider is DeepL and key is present', async () => {
    await facade.saveSettings({ translationProvider: 'DeepL', deeplApiKey: 'valid-key', deeplFreeApi: false });
    expect(facade.connectionStatus().status).toBe('connected');
  });

  it('should set connectionStatus to "invalid" when provider is DeepL but key is empty', async () => {
    await facade.saveSettings({ translationProvider: 'DeepL', deeplApiKey: '', deeplFreeApi: false });
    expect(facade.connectionStatus().status).toBe('invalid');
  });

  it('should set saveError when AdminService.updateSettings() fails', async () => {
    mockAdminService.updateSettings.mockReturnValue(throwError(() => new Error('Server error')));
    await facade.saveSettings({ translationProvider: 'Mock', deeplApiKey: '', deeplFreeApi: false });
    expect(facade.saveError()).toBe('Failed to save settings.');
  });

  it('should correctly map DTOs to SettingsViewModel via mapToViewModel', async () => {
    const dtos = [
      { key: 'TranslationProvider', value: 'DeepL' },
      { key: 'DeepLApiKey', value: 'abc' },
      { key: 'DeepLFreeApi', value: 'true' },
    ];
    mockAdminService.getSettings.mockReturnValue(of(dtos));
    await facade.loadSettings();
    expect(facade.settings()).toEqual({ translationProvider: 'DeepL', deeplApiKey: 'abc', deeplFreeApi: true });
  });
});
