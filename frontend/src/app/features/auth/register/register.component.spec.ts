import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';

import { RegisterComponent } from './register.component';
import { RegisterFacade } from './register.facade';

describe('RegisterComponent', () => {
  let fixture: ComponentFixture<RegisterComponent>;
  let component: RegisterComponent;
  let mockFacade: { register: jest.Mock };

  beforeEach(async () => {
    mockFacade = { register: jest.fn().mockResolvedValue(undefined) };

    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    })
      .overrideComponent(RegisterComponent, {
        set: { providers: [{ provide: RegisterFacade, useValue: mockFacade }] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should mark all controls as touched and NOT call facade.register() when form is empty', async () => {
    const button = fixture.debugElement.query(By.css('button[type="submit"]'));
    button.nativeElement.click();
    await fixture.whenStable();

    expect(component.form.touched).toBe(true);
    expect(mockFacade.register).not.toHaveBeenCalled();
  });

  it('should call facade.register() and set loading to true when form is valid', async () => {
    let resolveRegister!: () => void;
    mockFacade.register.mockReturnValue(new Promise<void>(resolve => (resolveRegister = resolve)));

    component.form.setValue({
      email: 'user@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    });
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button[type="submit"]'));
    button.nativeElement.click();

    expect(component.loading()).toBe(true);
    expect(mockFacade.register).toHaveBeenCalledWith('user@example.com', 'password123');

    resolveRegister();
    await fixture.whenStable();
  });

  it('should set the error signal when facade.register() rejects with an Error', async () => {
    mockFacade.register.mockRejectedValue(new Error('Email already in use.'));

    component.form.setValue({
      email: 'taken@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    });
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button[type="submit"]'));
    button.nativeElement.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.error()).toBe('Email already in use.');
    const banner = fixture.debugElement.query(By.css('.error-banner'));
    expect(banner).toBeTruthy();
  });
});
