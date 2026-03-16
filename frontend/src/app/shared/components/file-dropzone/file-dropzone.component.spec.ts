import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { FileDropzoneComponent } from './file-dropzone.component';

function createDropEvent(file: File): DragEvent {
  const dataTransfer = {
    files: Object.assign([file], { item: (i: number) => (i === 0 ? file : null) }),
  };
  return {
    preventDefault: jest.fn(),
    stopPropagation: jest.fn(),
    dataTransfer,
  } as unknown as DragEvent;
}

describe('FileDropzoneComponent', () => {
  let fixture: ComponentFixture<FileDropzoneComponent>;
  let component: FileDropzoneComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileDropzoneComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(FileDropzoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should emit fileSelected with the File when a valid PDF is dropped', () => {
    const file = new File(['content'], 'document.pdf', { type: 'application/pdf' });
    const dropEvent = createDropEvent(file);
    const fileSelectedSpy = jest.fn();
    component.fileSelected.subscribe(fileSelectedSpy);

    const dropzone = fixture.debugElement.query(By.css('.dropzone'));
    dropzone.triggerEventHandler('drop', dropEvent);
    fixture.detectChanges();

    expect(fileSelectedSpy).toHaveBeenCalledWith(file);
  });

  it('should set isInvalidFile to true when a non-PDF file is dropped', () => {
    const file = new File(['content'], 'image.png', { type: 'image/png' });
    const dropEvent = createDropEvent(file);

    const dropzone = fixture.debugElement.query(By.css('.dropzone'));
    dropzone.triggerEventHandler('drop', dropEvent);
    fixture.detectChanges();

    const invalidDropzone = fixture.debugElement.query(By.css('.file-invalid'));
    expect(invalidDropzone).toBeTruthy();
  });

  it('should call preventDefault on dragover', () => {
    const dragoverEvent = {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
    } as unknown as DragEvent;

    const dropzone = fixture.debugElement.query(By.css('.dropzone'));
    dropzone.triggerEventHandler('dragover', dragoverEvent);

    expect(dragoverEvent.preventDefault).toHaveBeenCalled();
  });
});
