import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-admin-languages',
  standalone: true,
  template: '<p>Admin Languages</p>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminLanguagesComponent {}
