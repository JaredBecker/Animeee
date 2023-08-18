import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';

import { AuthService } from '@shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {
    public sign_in_form = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(25)]),
    });

    constructor(
        private authService: AuthService,
        private titleService: Title,
        private toastr: ToastrService,
    ) {
        this.titleService.setTitle(`Animeee | Sign In`);
    }

    public onSignIn() {
        if (this.sign_in_form.status === 'VALID') {
            const email = this.sign_in_form.controls.email.value;
            const password = this.sign_in_form.controls.password.value;

            if (email && password) {
                this.authService.signIn(email, password);
            }
        } else {
            if (this.sign_in_form.controls.email.status === 'INVALID') {
                this.toastr.error('Please make sure you use a valid email address. Eg: example@email.com', 'Invalid Email');
                return;
            }

            if (this.sign_in_form.controls.password.status === 'INVALID') {
                this.toastr.error('Password must be greater than 6 characters and less than 25', 'Invalid Password');
                return;
            }
        }
    }

    public googleSignIn() {
        this.authService.googleAuth();
    }
}
