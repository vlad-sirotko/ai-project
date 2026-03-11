import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AdminSettingsFacade } from './admin-settings.facade';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  template: '<p>Admin Settings</p>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AdminSettingsFacade],
})
export class AdminSettingsComponent {}
