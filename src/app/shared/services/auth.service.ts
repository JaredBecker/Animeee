import { User } from './../models/user.interface';

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import {
    Observable,
    firstValueFrom,
    map
} from 'rxjs';
import * as FirebaseAuth from 'firebase/auth';

import { PageLoaderService } from './page-loader.service';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private $authStream: Observable<boolean>;

    constructor(
        private router: Router,
        private angularFireAuth: AngularFireAuth,
        private pageLoaderService: PageLoaderService,

    ) {
        // Store firebase auth stream
        this.$authStream = this.angularFireAuth.user.pipe(
            map(user => user ? true : false)
        );
    }

    /**
     * Gets the stream tracking the auth state
     *
     * @returns Auth stream
     */
    public getAuthStream(): Observable<boolean> {
        return this.$authStream;
    }

    /**
     * Gets the info of the current user
     *
     * @returns User info or null
     */
    public async getUserInfo() {
        const user = await firstValueFrom(
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
        this.pageLoaderService.setLoadingState({state: true, title: 'Logging In'});

        return this.angularFireAuth
            .signInWithEmailAndPassword(email, password)
            .then(result => {
                console.log(result);
                this.router.navigateByUrl('/');
            })
            .catch((error) => {
                window.alert(error.message);
                this.pageLoaderService.setLoadingState(false);
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
        this.pageLoaderService.setLoadingState({state: true, title: 'Creating Account'});

        return this.angularFireAuth
            .createUserWithEmailAndPassword(email, password)
            .then((result) => {
                // TODO: figure out how to do email verification for users who don't use Google sign in
                this.router.navigateByUrl('/');
            })
            .catch((error) => {
                this.pageLoaderService.setLoadingState(false);
                console.error(error.message);
            });
    }

    /**
     * Sends Forgot password link to provided email
     *
     * @param passwordResetEmail Email to send link to
     *
     * @returns void
     */
    public forgotPassword(passwordResetEmail: string) {
        return this.angularFireAuth
            .sendPasswordResetEmail(passwordResetEmail)
            .then(() => {
                window.alert('Password reset email sent, check your inbox.');
            })
            .catch((error) => {
                window.alert(error);
            });
    }

    /**
     * Requests login using Google Account
     */
    public googleAuth(): void {
        this.pageLoaderService.setLoadingState({state: true, title: 'Logging In'});
        this.authLogin(new FirebaseAuth.GoogleAuthProvider())
    }

    // Auth logic to run auth providers
    public authLogin(provider: any) {
        return this.angularFireAuth
            .signInWithPopup(provider)
            .then(() => {
                this.router.navigateByUrl('/');
            })
            .catch((error) => {
                // Install toaster here for better UI
                console.error(error);
                this.pageLoaderService.setLoadingState(false);
            });
    }

    /**
     * Signs the current user out
     */
    public signOut(): void {
        this.pageLoaderService.setLoadingState({state: true, title: 'Logging Out'});
        this.angularFireAuth.signOut()

        // Sign out is so dam fast and I want to show my loader I worked hard on🤣
        setTimeout(() => {
            const url = window.location.toString();

            if (url.includes('profile')) {
                this.router.navigateByUrl('/');
            } else {
                this.pageLoaderService.setLoadingState(false);
            }
        }, 500);
    }
}
