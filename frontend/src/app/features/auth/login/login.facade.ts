import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AuthStore } from '../../../core/stores/auth.store';

@Injectable()
export class LoginFacade {
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  async login(email: string, password: string): Promise<void> {
    await this.authStore.login(email, password);
    await this.router.navigate(['/app/upload']);
  }
}
