import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { firstValueFrom, map } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { User } from '@shared/models/user.interface';
import * as firebase from "firebase/app";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private user?: User;

    constructor(
        private angularFirestore: AngularFirestore,
        private angularFireAuth: AngularFireAuth,
        private toastr: ToastrService,
    ) { }

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
                [], [], [], [], [], []
            );

            this.angularFirestore.collection('users').doc(user.uid).set(new_user.asObject())
                .catch(err => {
                    console.log(err);

                })
        }
    }

    /**
     * Checks if a users email exists in the database
     * @param user The user response from sign up or login
     *
     * @returns Obj of user details and boolean for user_exists
     */
    public async checkIfUserExists(user: any) {
        const user_exists = await firstValueFrom(
            this.angularFirestore.collection('users')
                .doc(user.uid)
                .get()
                .pipe(
                    map((doc) => doc.exists)
                )
        )

        return { user, user_exists }
    }

    /**
     * Add an anime to user completed list
     *
     * @param anime Anime details to add
     *
     * @returns void
     */
    public async addToComplete(anime: any): Promise<void> {
        const user = await this.getUserInfo();

        if (user?.uid) {
            const record: User | undefined = await firstValueFrom(
                this.angularFirestore.collection('users').doc<User>(user.uid).valueChanges()
            );

            if (record) {
                const not_already_selected = record.completed.every(el => el['id'] !== anime.id);

                if (not_already_selected) {
                    // Get rid of properties not needed
                    delete anime.links;
                    delete anime.relationships;

                    record.completed.push(anime);
                    this.angularFirestore.collection('users').doc(user.uid).set(record);
                    this.toastr.success('The anime has been added to your completed list!', 'Anime Added');
                } else {
                    this.toastr.error('This anime is already added to your completed list', 'Already In Complete');
                }

                return;
            }

            this.toastr.success('The anime has been added to your completed list!', 'Anime Added');

            return;
        }

        this.toastr.error('This action could not be completed because no account could be found.', 'No Account found');
    }
}
