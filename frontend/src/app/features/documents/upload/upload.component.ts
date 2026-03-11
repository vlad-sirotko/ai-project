import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-upload',
  standalone: true,
  template: '<p>Upload</p>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadComponent {}
