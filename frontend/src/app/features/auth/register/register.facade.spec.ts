import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { AuthStore } from '../../../core/stores/auth.store';
import { RegisterFacade } from './register.facade';

describe('RegisterFacade', () => {
  let facade: RegisterFacade;
  let mockAuthStore: { register: jest.Mock };
  let mockRouter: { navigate: jest.Mock };

  beforeEach(() => {
    mockAuthStore = { register: jest.fn().mockResolvedValue(undefined) };
    mockRouter = { navigate: jest.fn().mockResolvedValue(true) };

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        RegisterFacade,
        { provide: AuthStore, useValue: mockAuthStore },
        { provide: Router, useValue: mockRouter },
      ],
    });

    facade = TestBed.inject(RegisterFacade);
  });

  it('should call AuthStore.register() with the provided credentials', async () => {
    await facade.register('user@example.com', 'password123');
    expect(mockAuthStore.register).toHaveBeenCalledWith('user@example.com', 'password123');
  });

  it('should navigate to /app/upload after a successful registration', async () => {
    await facade.register('user@example.com', 'password123');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/app/upload']);
  });

  it('should propagate an error thrown by AuthStore.register()', async () => {
    mockAuthStore.register.mockRejectedValue(new Error('Email already taken'));
    await expect(facade.register('taken@example.com', 'password123')).rejects.toThrow(
      'Email already taken',
    );
  });
});
