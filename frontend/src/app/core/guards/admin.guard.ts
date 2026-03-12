import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthStore } from '../stores/auth.store';

export const adminGuard: CanActivateFn = async () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  await authStore.getSessionRestorePromise();

  if (!authStore.isAuthenticated()) {
    return router.createUrlTree(['/auth/login']);
  }

  if (!authStore.isAdmin()) {
    return router.createUrlTree(['/app/upload']);
  }

  return true;
};
