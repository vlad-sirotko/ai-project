import { ChangeDetectionStrategy, Component } from '@angular/core';

import { TranslationDetailFacade } from './translation-detail.facade';

@Component({
  selector: 'app-translation-detail',
  standalone: true,
  template: '<p>Translation Detail</p>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TranslationDetailFacade],
})
export class TranslationDetailComponent {}
