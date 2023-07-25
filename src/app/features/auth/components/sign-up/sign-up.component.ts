import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { AuthService } from '@shared/services/auth.service';

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
    constructor(
        private authService: AuthService,
        private titleService: Title,
    ) {
        this.titleService.setTitle(`Animeee | Sign Up`);
    }

    public onSignUp(email: string, password: string) {
        this.authService.signUp(email, password);
    }

    public googleSignIn() {
        this.authService.googleAuth();
    }
}
