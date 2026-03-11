import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-translation-detail',
  standalone: true,
  template: '<p>Translation Detail</p>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TranslationDetailComponent {}
