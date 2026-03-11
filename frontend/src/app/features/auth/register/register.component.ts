import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-register',
  standalone: true,
  template: '<p>Register</p>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {}
