import { Component } from '@angular/core';
import { AuthService } from '@shared/services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {
    constructor(private authService: AuthService) { }

    public onSignIn(email: string, password: string) {

    }

    public googleSignIn() {
        this.authService.googleAuth();
    }
}
