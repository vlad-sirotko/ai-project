import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { AuthStore } from '../../../core/stores/auth.store';
import { LoginFacade } from './login.facade';

describe('LoginFacade', () => {
  let facade: LoginFacade;
  let mockAuthStore: { login: jest.Mock };
  let mockRouter: { navigate: jest.Mock };

  beforeEach(() => {
    mockAuthStore = { login: jest.fn().mockResolvedValue(undefined) };
    mockRouter = { navigate: jest.fn().mockResolvedValue(true) };

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        LoginFacade,
        { provide: AuthStore, useValue: mockAuthStore },
        { provide: Router, useValue: mockRouter },
      ],
    });

    facade = TestBed.inject(LoginFacade);
  });

  it('should call AuthStore.login() with the provided credentials', async () => {
    await facade.login('user@example.com', 'password123');
    expect(mockAuthStore.login).toHaveBeenCalledWith('user@example.com', 'password123');
  });

  it('should navigate to /app/upload after a successful login', async () => {
    await facade.login('user@example.com', 'password123');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/app/upload']);
  });

  it('should propagate an error thrown by AuthStore.login()', async () => {
    mockAuthStore.login.mockRejectedValue(new Error('Invalid credentials'));
    await expect(facade.login('bad@example.com', 'wrong')).rejects.toThrow('Invalid credentials');
  });
});
