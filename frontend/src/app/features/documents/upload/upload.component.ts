import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { FileDropzoneComponent } from '../../../shared/components/file-dropzone/file-dropzone.component';
import { LanguageSelectorComponent } from '../../../shared/components/language-selector/language-selector.component';
import { UploadFacade } from './upload.facade';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [FileDropzoneComponent, LanguageSelectorComponent],
  providers: [UploadFacade],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadComponent {
  protected readonly facade = inject(UploadFacade);
}
