
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
    AngularFirestore,
    AngularFirestoreDocument
} from '@angular/fire/compat/firestore';

import * as FirebaseAuth from 'firebase/auth';
import {
    Observable,
    BehaviorSubject,
    firstValueFrom,
    map
} from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private $authStream: Observable<boolean>;

    constructor(
        public angularFirestore: AngularFirestore,
        public angularFireAuth: AngularFireAuth,
        public router: Router,
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
        return this.angularFireAuth
            .signInWithEmailAndPassword(email, password)
            .then(result => {
                console.log(result);
                this.router.navigateByUrl('/');
            })
            .catch((error) => {
                window.alert(error.message);
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
        return this.angularFireAuth
            .createUserWithEmailAndPassword(email, password)
            .then((result) => {
                // TODO: figure out how to do email verification for users who don't use Google sign in
                this.router.navigateByUrl('/');
            })
            .catch((error) => {
                window.alert(error.message);
            });
    }

    /**
     *
     * @param passwordResetEmail
     * @returns
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
        this.authLogin(new FirebaseAuth.GoogleAuthProvider())
    }

    // Auth logic to run auth providers
    public authLogin(provider: any) {
        return this.angularFireAuth
            .signInWithPopup(provider)
            .then(() => this.router.navigateByUrl('/'))
            .catch((error) => {
                // Install toaster here for better UI
                window.alert(error);
            });
    }

    /**
     * Signs the current user out
     */
    public signOut(): void {
        this.angularFireAuth.signOut()
    }
}
