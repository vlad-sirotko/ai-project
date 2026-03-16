import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';

import { LoginComponent } from './login.component';
import { LoginFacade } from './login.facade';

describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;
  let mockFacade: { login: jest.Mock };

  beforeEach(async () => {
    mockFacade = { login: jest.fn().mockResolvedValue(undefined) };

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    })
      .overrideComponent(LoginComponent, {
        set: { providers: [{ provide: LoginFacade, useValue: mockFacade }] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should mark all controls as touched and NOT call facade.login() when form is empty', async () => {
    const button = fixture.debugElement.query(By.css('button[type="submit"]'));
    button.nativeElement.click();
    await fixture.whenStable();

    expect(component.form.touched).toBe(true);
    expect(mockFacade.login).not.toHaveBeenCalled();
  });

  it('should call facade.login() and set loading to true when form is valid', async () => {
    let resolveLogin!: () => void;
    mockFacade.login.mockReturnValue(new Promise<void>(resolve => (resolveLogin = resolve)));

    component.form.setValue({ email: 'user@example.com', password: 'password123' });
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button[type="submit"]'));
    button.nativeElement.click();

    // loading should be true before the promise resolves
    expect(component.loading()).toBe(true);
    expect(mockFacade.login).toHaveBeenCalledWith('user@example.com', 'password123');

    resolveLogin();
    await fixture.whenStable();
  });

  it('should set the error signal when facade.login() rejects', async () => {
    mockFacade.login.mockRejectedValue(new Error('bad creds'));

    component.form.setValue({ email: 'user@example.com', password: 'wrongpass' });
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button[type="submit"]'));
    button.nativeElement.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.error()).toBe('Invalid email or password.');
    const banner = fixture.debugElement.query(By.css('.error-banner'));
    expect(banner).toBeTruthy();
  });
});
