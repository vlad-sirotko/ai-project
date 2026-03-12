import { computed, inject, Injectable } from '@angular/core';

import { AuthStore } from '../../core/stores/auth.store';
import { Router } from '@angular/router';

@Injectable()
export class MainLayoutFacade {
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  readonly userEmail = computed(() => this.authStore.currentUser()?.email ?? '');
  readonly isAdmin = computed(() => this.authStore.isAdmin());

  logout(): void {
    this.authStore.logout();
    this.router.navigate(['/auth/login']);
  }
}
