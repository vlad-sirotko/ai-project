import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-translations-list',
  standalone: true,
  template: '<p>Translations List</p>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TranslationsListComponent {}
