import { provideZonelessChangeDetection, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { AuthStore } from '../../core/stores/auth.store';
import { UserModel } from '../../shared/models/user.model';
import { MainLayoutFacade } from './main-layout.facade';

describe('MainLayoutFacade', () => {
  let facade: MainLayoutFacade;
  let userSignal: ReturnType<typeof signal<UserModel | null>>;
  let isAdminSignal: ReturnType<typeof signal<boolean>>;
  let mockAuthStore: { currentUser: () => UserModel | null; isAdmin: () => boolean; logout: jest.Mock };
  let mockRouter: { navigate: jest.Mock };

  beforeEach(() => {
    userSignal = signal<UserModel | null>(null);
    isAdminSignal = signal(false);

    mockAuthStore = {
      currentUser: userSignal,
      isAdmin: isAdminSignal,
      logout: jest.fn(),
    };
    mockRouter = { navigate: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        MainLayoutFacade,
        { provide: AuthStore, useValue: mockAuthStore },
        { provide: Router, useValue: mockRouter },
      ],
    });

    facade = TestBed.inject(MainLayoutFacade);
  });

  it('should return the email from the mocked AuthStore', () => {
    userSignal.set({ id: '1', email: 'alice@example.com', role: 'User', preferredTargetLanguage: null });
    expect(facade.userEmail()).toBe('alice@example.com');
  });

  it('should return empty string when user is null', () => {
    userSignal.set(null);
    expect(facade.userEmail()).toBe('');
  });

  it('should return true for isAdmin when role is Admin', () => {
    isAdminSignal.set(true);
    expect(facade.isAdmin()).toBe(true);
  });

  it('should return false for isAdmin when role is User', () => {
    isAdminSignal.set(false);
    expect(facade.isAdmin()).toBe(false);
  });

  it('should call AuthStore.logout() and navigate to /auth/login on logout()', () => {
    facade.logout();
    expect(mockAuthStore.logout).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/login']);
  });
});
