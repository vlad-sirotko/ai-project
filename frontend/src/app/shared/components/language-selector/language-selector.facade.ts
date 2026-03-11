import { inject, Injectable, Signal } from '@angular/core';

import { LanguageStore } from '../../../core/stores/language.store';
import { SupportedLanguageModel } from '../../models/supported-language.model';

@Injectable()
export class LanguageSelectorFacade {
  private readonly languageStore = inject(LanguageStore);

  readonly activeLanguages: Signal<SupportedLanguageModel[]> = this.languageStore.activeLanguages;
  readonly isLoading: Signal<boolean> = this.languageStore.isLoading;

  loadLanguages(): Promise<void> {
    return this.languageStore.loadLanguages();
  }
}
