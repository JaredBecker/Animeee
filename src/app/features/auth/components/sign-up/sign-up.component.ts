import { Component } from '@angular/core';
import { AuthService } from '@shared/services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
    constructor(private authService: AuthService) { }

    public onSignUp(email: string, password: string) {
        this.authService.signUp(email, password);
    }
}
