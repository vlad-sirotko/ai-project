import { ChangeDetectionStrategy, Component } from '@angular/core';

import { TranslationsListFacade } from './translations-list.facade';

@Component({
  selector: 'app-translations-list',
  standalone: true,
  template: '<p>Translations List</p>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TranslationsListFacade],
})
export class TranslationsListComponent {}
