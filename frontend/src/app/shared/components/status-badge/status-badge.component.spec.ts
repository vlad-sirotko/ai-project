import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { JobStatus } from '../../models/translation-job.model';
import { StatusBadgeComponent } from './status-badge.component';

describe('StatusBadgeComponent', () => {
  let fixture: ComponentFixture<StatusBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusBadgeComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(StatusBadgeComponent);
  });

  function setStatus(status: JobStatus): void {
    fixture.componentRef.setInput('status', status);
    fixture.detectChanges();
  }

  it('should apply "badge--pending" class for Pending status', () => {
    setStatus('Pending');
    const badge = fixture.debugElement.query(By.css('.badge--pending'));
    expect(badge).toBeTruthy();
  });

  it('should apply "badge--processing" class for Processing status', () => {
    setStatus('Processing');
    const badge = fixture.debugElement.query(By.css('.badge--processing'));
    expect(badge).toBeTruthy();
  });

  it('should apply "badge--completed" class for Completed status', () => {
    setStatus('Completed');
    const badge = fixture.debugElement.query(By.css('.badge--completed'));
    expect(badge).toBeTruthy();
  });

  it('should apply "badge--failed" class for Failed status', () => {
    setStatus('Failed');
    const badge = fixture.debugElement.query(By.css('.badge--failed'));
    expect(badge).toBeTruthy();
  });
});
