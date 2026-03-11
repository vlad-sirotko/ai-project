import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  output,
} from '@angular/core';

import { LanguageSelectorFacade } from './language-selector.facade';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  providers: [LanguageSelectorFacade],
  templateUrl: './language-selector.component.html',
  styleUrl: './language-selector.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSelectorComponent implements OnInit {
  private readonly facade = inject(LanguageSelectorFacade);

  readonly label = input<string>('');
  readonly value = input<string>('');
  readonly languageSelected = output<string>();

  protected readonly activeLanguages = this.facade.activeLanguages;
  protected readonly isLoading = this.facade.isLoading;

  ngOnInit(): void {
    this.facade.loadLanguages();
  }

  protected onSelectionChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.languageSelected.emit(select.value);
  }
}
