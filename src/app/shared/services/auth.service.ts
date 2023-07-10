import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { GoogleAuthProvider } from 'firebase/auth';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(
        public afAuth: AngularFireAuth // Inject Firebase auth service
    ) { }
    // Sign in with Google
    public GoogleAuth() {
        return this.AuthLogin(new GoogleAuthProvider());
    }
    // Auth logic to run auth providers
    public AuthLogin(provider: any) {

        return this.afAuth
            .signInWithPopup(provider)
            .then((result) => {
                console.log(result);
                console.log('You have been successfully logged in!');
            })
            .catch((error) => {
                console.log('stuff no worky');
                console.log(error);
            });
    }
}
