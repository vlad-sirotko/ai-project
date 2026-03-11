import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () =>
      import('./layouts/auth-layout/auth-layout.component').then(
        (m) => m.AuthLayoutComponent
      ),
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: 'app',
    loadComponent: () =>
      import('./layouts/main-layout/main-layout.component').then(
        (m) => m.MainLayoutComponent
      ),
    canActivate: [authGuard],
    children: [
      {
        path: 'upload',
        loadComponent: () =>
          import('./features/documents/upload/upload.component').then(
            (m) => m.UploadComponent
          ),
      },
      {
        path: 'translations',
        loadComponent: () =>
          import('./features/documents/translations-list/translations-list.component').then(
            (m) => m.TranslationsListComponent
          ),
      },
      {
        path: 'translations/:id',
        loadComponent: () =>
          import('./features/documents/translation-detail/translation-detail.component').then(
            (m) => m.TranslationDetailComponent
          ),
      },
      { path: '', redirectTo: 'upload', pathMatch: 'full' },
    ],
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./layouts/admin-layout/admin-layout.component').then(
        (m) => m.AdminLayoutComponent
      ),
    canActivate: [authGuard, adminGuard],
    children: [
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/admin/settings/admin-settings.component').then(
            (m) => m.AdminSettingsComponent
          ),
      },
      {
        path: 'languages',
        loadComponent: () =>
          import('./features/admin/languages/admin-languages.component').then(
            (m) => m.AdminLanguagesComponent
          ),
      },
      { path: '', redirectTo: 'settings', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: '**', redirectTo: 'auth/login' },
];
