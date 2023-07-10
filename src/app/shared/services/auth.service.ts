import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
    AngularFirestore,
    AngularFirestoreDocument
} from '@angular/fire/compat/firestore';

import * as FirebaseAuth from 'firebase/auth';

import { User } from '../models/user.interface';
import { of, Observable, BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    public user_data?: any; // Save logged in user data

    private $userLoggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);

    constructor(
        public angularFirestore: AngularFirestore, // Inject Firestore service
        public angularFireAuth: AngularFireAuth, // Inject Firebase auth service
        public router: Router,
        public ngZone: NgZone // NgZone service to remove outside scope warning
    ) {
        /* Saving user data in localStorage when
        logged in and setting up null when logged out */

        // This seems to be getting my details somehow so I've commented it out for now

        // this.angularFireAuth.authState.subscribe((user) => {
        //     if (user) {
        //         this.userData = user;
        //         localStorage.setItem('user', JSON.stringify(this.userData));
        //         JSON.parse(localStorage.getItem('user')!);
        //     } else {
        //         localStorage.setItem('user', 'null');
        //         JSON.parse(localStorage.getItem('user')!);
        //     }
        // });
    }

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
                this.setUserData(result.user);

                this.angularFireAuth.authState.subscribe({
                    next: (user) => {
                        if (user) {
                            console.log('USER FROM SIGN IN');
                            console.log(user);

                            this.router.navigateByUrl('/');
                        }
                    },
                    error: (error) => {
                        console.log('ERROR FROM SIGN IN SUBSCRIPTION');
                        console.log(error);
                    }
                });
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
                this.setUserData(result.user);
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

    // Returns true when user is logged in and email is verified
    public isLoggedIn(): Observable<boolean> {
        // const user = JSON.parse(localStorage.getItem('user')!);
        // return user !== null && user.emailVerified !== false ? true : false;

        return this.$userLoggedInSubject.asObservable();
    }

    // Sign in with Google
    public googleAuth() {
        return this.authLogin(new FirebaseAuth.GoogleAuthProvider())
            .then((res: any) => {
                console.log(res);
                this.router.navigateByUrl('/');
            });
    }

    // Auth logic to run auth providers
    public authLogin(provider: any) {
        return this.angularFireAuth
            .signInWithPopup(provider)
            .then((result) => {
                this.router.navigateByUrl('/');
                this.setUserData(result.user);
            })
            .catch((error) => {
                window.alert(error);
            });
    }

    /* Setting up user data when sign in with username/password,
    sign up with username/password and sign in with social auth
    provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
    public setUserData(user: any) {
        const userRef: AngularFirestoreDocument<any> = this.angularFirestore.doc(
            `users/${user.uid}`
        );

        const userData: User = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            emailVerified: user.emailVerified,
        };

        return userRef.set(userData, {
            merge: true,
        });
    }

    // Sign out
    public signOut() {
        return this.angularFireAuth.signOut().then(() => {
            localStorage.removeItem('user');
            this.router.navigateByUrl('/auth/sign-in');
        });
    }
}
