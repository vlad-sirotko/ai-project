import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AdminLanguagesFacade } from './admin-languages.facade';

@Component({
  selector: 'app-admin-languages',
  standalone: true,
  template: '<p>Admin Languages</p>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AdminLanguagesFacade],
})
export class AdminLanguagesComponent {}
