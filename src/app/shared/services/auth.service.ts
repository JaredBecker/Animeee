import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { Observable, firstValueFrom, map } from 'rxjs';

import * as FirebaseAuth from 'firebase/auth';
import { ToastrService } from 'ngx-toastr';

import { PageLoaderService } from './page-loader.service';
import { UserService } from './user.service';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(
        private router: Router,
        private angularFireAuth: AngularFireAuth,
        private pageLoaderService: PageLoaderService,
        private toastr: ToastrService,
        private userService: UserService,
    ) { }

    /**
     * Gets the stream tracking the auth state
     *
     * @returns Auth stream
     */
    public getAuthStream(): Observable<boolean> {
        return this.angularFireAuth.user.pipe(
            map(user => user ? true : false),
        )
    }

    /**
     * Gets the info of the current user
     *
     * @returns User info or null
     */
    public getUserInfo() {
        const user = firstValueFrom(
            this.angularFireAuth.user.pipe(
                map(user => {
                    return user;
                })
            )
        );

        return user;
    }

    /**
     * Checks if the current user is logged in
     *
     * @returns Boolean indicating if the user is logged in or not
     */
    public async isAuthenticated() {
        const isAuthenticated = await firstValueFrom(
            this.angularFireAuth.user.pipe(
                map(user => user ? true : false)
            )
        );

        return isAuthenticated;
    }

    /**
     * Handles login with email and password for firebase
     *
     * @param email The email of the user
     * @param password Password for the user
     *
     * @returns void
     */
    public signIn(email: string, password: string): Promise<void> {
        this.pageLoaderService.setLoadingState({ state: true, title: 'Logging In' });

        return this.angularFireAuth
            .signInWithEmailAndPassword(email, password)
            .then(async (result) => {
                if (result.user?.emailVerified) {
                    const firestore_user = await this.userService.getUserProfileInfo();

                    if (firestore_user) {
                        if (!firestore_user.email_verified) {
                            firestore_user.email_verified = result.user.emailVerified;
                        }

                        this.userService.updateUserStream(firestore_user);
                    }

                    this.router.navigateByUrl('/');
                    this.toastr.success('Welcome back!', 'Logged In!');
                } else {
                    this.toastr.error('Please check your email for verification link! Be sure to check spam folder as well!', 'Account Not Verified', {
                        timeOut: 0,
                    });
                    this.pageLoaderService.setLoadingState(false);
                }
            })
            .catch((error) => {
                this.pageLoaderService.setLoadingState(false);
                this.toastr.error('Please check email/password and try again.', 'Incorrect Details');
            });
    }

    /**
     * Signs up new user
     *
     * @param email The email of the user
     * @param password The password for the user
     *
     * @returns void
     */
    public signUp(email: string, password: string): Promise<void> {
        this.pageLoaderService.setLoadingState({ state: true, title: 'Creating Account' });

        return this.angularFireAuth
            .createUserWithEmailAndPassword(email, password)
            .then(result => {
                this.userService.createNewUserRecord(result.user);
                this.sendVerificationEmail(result.user);
                this.toastr.success('Please note you need to verify your email before you will be able to login again!', 'Account Created!', {
                    timeOut: 0,
                });
            })
            .catch((error) => {
                let output = error.message;
                output = output.replace('Firebase: ', '');
                output = output.replace('(auth/email-already-in-use).', '');

                this.toastr.error(output, 'Error Signing Up');
                this.pageLoaderService.setLoadingState(false);
            });
    }

    /**
     * Checks for current users and send them a verify email link
     *
     * @returns void
     */
    public sendVerificationEmail(user: any) {
        user.sendEmailVerification().then((res: any) => {
            this.pageLoaderService.setLoadingState(false);
            this.router.navigateByUrl('/');
        },
            (err: any) => {
                console.error('something went wrong', err);
                this.pageLoaderService.setLoadingState(false);
                this.router.navigateByUrl('/');
            })
    }

    /**
     * Sends Forgot password link to provided email
     *
     * @param passwordResetEmail Email to send link to
     *
     * @returns void
     */
    public forgotPassword(passwordResetEmail: string): Promise<void> {
        return this.angularFireAuth
            .sendPasswordResetEmail(passwordResetEmail)
            .then(() => {
                this.toastr.success('Be sure to check your spam folder if the email isn\'t in your main inbox!', 'Link Sent! 📨');
            })
            .catch((error) => {
                this.toastr.error('Seems like that email is incorrect or doesn\'t exist. Please check and try again.', 'Something Went Wrong!');
            });
    }

    /**
     * Requests login using Google Account
     */
    public googleAuth(): void {
        this.pageLoaderService.setLoadingState({ state: true, title: 'Logging In' });
        this.signInWithProvider(new FirebaseAuth.GoogleAuthProvider())
    }

    /**
     * Attempts to login user using the provided provider
     *
     * @param provider The provider to login with
     *
     * @returns void
     */
    public signInWithProvider(provider: any): Promise<void> {
        return this.angularFireAuth
            .signInWithPopup(provider)
            .then((result: any) => this.userService.checkIfUserExists(result.user))
            .then(async (res) => {
                if (!res.user_exists) {
                    this.userService.createNewUserRecord(res.user);
                } else {
                    const user = await this.userService.getUserProfileInfo();
                    this.userService.updateUserStream(user);
                }
            })
            .then(() => {
                this.router.navigateByUrl('/');
                this.pageLoaderService.setLoadingState(false);
                this.toastr.success('Welcome back!', 'Logged In!');
            })
            .catch((error) => {
                console.error(error);
                this.pageLoaderService.setLoadingState(false);
                this.toastr.error('Welcome back!', 'Logged In!');
            });
    }

    /**
     * Signs the current user out
     */
    public signOut(): void {
        this.pageLoaderService.setLoadingState({ state: true, title: 'Logging Out' });
        this.angularFireAuth.signOut();

        const url = window.location.toString();
        url.includes('profile') ? this.router.navigateByUrl('/') : this.pageLoaderService.setLoadingState(false);

        this.userService.updateUserStream(undefined);
        this.toastr.success('Goodbye for now!', 'Logged Out!');
    }
}
