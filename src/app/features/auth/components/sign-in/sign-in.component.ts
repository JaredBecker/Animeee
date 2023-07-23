import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { AuthService } from '@shared/services/auth.service';

@Component({
    selector: 'app-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {
    constructor(
        private authService: AuthService,
        private titleService: Title,
    ) {
        this.titleService.setTitle(`Animeee | Sign In`);
    }

    public onSignIn(email: string, password: string) {
        this.authService.signIn(email, password);
    }

    public googleSignIn() {
        this.authService.googleAuth();
    }
}
