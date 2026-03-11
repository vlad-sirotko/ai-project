import { ChangeDetectionStrategy, Component } from '@angular/core';

import { UploadFacade } from './upload.facade';

@Component({
  selector: 'app-upload',
  standalone: true,
  template: '<p>Upload</p>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UploadFacade],
})
export class UploadComponent {}
