import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/compat/firestore';

import { User } from '@shared/models/user.interface';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private user?: User;

    constructor(
        private angularFirestore: AngularFirestore,
    ) { }

    /**
     * Takes a user response from firebase and create a document inside user collection
     *
     * @param user User response from signing up / logging in
     */
    public createNewUserRecord(user: any) {
        if (user) {
            const new_user = new User(
                user.uid,
                user.email,
                user.displayName ?? user.email.split('@')[0],
                user.photoUrl ?? '',
                user.emailVerified,
                [],[],[],[],[],[]
            );

            this.angularFirestore.collection('users').doc(user.uid).set(new_user.asObject())
                .then(result => {
                    console.log(result);
                    console.log('user inserted check db');
                })
                .catch(err => {
                    console.log(err);
                    console.log('da tings not working fam');
                })
        }
    }
}
