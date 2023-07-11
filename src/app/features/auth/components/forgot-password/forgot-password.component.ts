import { Component } from '@angular/core';

import { AuthService } from '@shared/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
    constructor(private authService: AuthService) { }

    public recoverPassword(email: string) {
        this.authService.forgotPassword(email);
    }
}
