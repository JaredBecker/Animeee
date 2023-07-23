import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { AuthService } from '@shared/services/auth.service';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
    constructor(
        private authService: AuthService,
        private titleService: Title,
    ) {
        this.titleService.setTitle(`Animeee | Forgot Password`);
    }

    public recoverPassword(email: string) {
        this.authService.forgotPassword(email);
    }
}
