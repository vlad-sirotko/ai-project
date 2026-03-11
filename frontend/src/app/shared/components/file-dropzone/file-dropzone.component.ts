import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'app-file-dropzone',
  standalone: true,
  templateUrl: './file-dropzone.component.html',
  styleUrl: './file-dropzone.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileDropzoneComponent {
  readonly accept = input<string>('.pdf');
  readonly fileSelected = output<File>();

  protected readonly isDragOver = signal(false);
  protected readonly selectedFile = signal<File | null>(null);

  protected readonly fileInput =
    viewChild.required<ElementRef<HTMLInputElement>>('fileInput');

  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver.set(true);
  }

  protected onDragLeave(): void {
    this.isDragOver.set(false);
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver.set(false);
    const file = event.dataTransfer?.files[0];
    if (file) {
      this.selectFile(file);
    }
  }

  protected openFilePicker(): void {
    this.fileInput().nativeElement.click();
  }

  protected onFileInputChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectFile(file);
    }
  }

  protected formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  private selectFile(file: File): void {
    this.selectedFile.set(file);
    this.fileSelected.emit(file);
  }
}
