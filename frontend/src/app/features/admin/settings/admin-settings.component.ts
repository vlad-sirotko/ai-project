import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  template: '<p>Admin Settings</p>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminSettingsComponent {}
