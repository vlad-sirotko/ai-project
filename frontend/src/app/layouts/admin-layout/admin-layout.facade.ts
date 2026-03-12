import { computed, inject, Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';

import { AuthStore } from '../../core/stores/auth.store';

@Injectable()
export class AdminLayoutFacade {
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  readonly userEmail = computed(() => this.authStore.currentUser()?.email ?? '');

  private readonly routeTitle = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      startWith(null),
      map(() => this.getSectionTitle()),
    ),
    { initialValue: this.getSectionTitle() },
  );

  readonly sectionTitle = computed(() => this.routeTitle());

  private getSectionTitle(): string {
    const url = this.router.url;
    if (url.includes('/admin/languages')) return 'Languages';
    if (url.includes('/admin/settings')) return 'Settings';
    return '';
  }
}
