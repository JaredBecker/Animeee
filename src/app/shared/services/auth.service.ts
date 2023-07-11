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

import { User } from '../models/user.interface';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(
        public angularFirestore: AngularFirestore, // Inject Firestore service
        public angularFireAuth: AngularFireAuth, // Inject Firebase auth service
        public router: Router,
    ) { }

    /**
     * Handles login with email and password for firebase
     *
     * @param email The email of the user
     * @param password Password for the user
     *
     * @returns
     */
    public signIn(email: string, password: string): Promise<void> {
        return this.angularFireAuth
            .signInWithEmailAndPassword(email, password)
            .then(result => {
                console.log('signed in');
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
     * @returns
     */
    public signUp(email: string, password: string): Promise<void> {
        return this.angularFireAuth
            .createUserWithEmailAndPassword(email, password)
            .then((result) => {
                /* Call the SendVerificaitonMail() function when new user sign
                up and returns promise */
                this.sendVerificationMail();
            })
            .catch((error) => {
                window.alert(error.message);
            });
    }

    // Send email verification when new user sign up
    public sendVerificationMail() {
        return this.angularFireAuth.currentUser
            .then((u: any) => u.sendEmailVerification())
            .then(() => {
                this.router.navigate(['verify-email-address']);
            });
    }

    // Reset forgot password
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
