import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { firstValueFrom, map } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { User } from '@shared/models/user.interface';

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
     * Gets the info of the current user (Firebase info)
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
     * Get the info for the user profile stored in firestore database
     *
     * @returns User
     */
    public async getUserProfileInfo(): Promise<User | undefined> {
        if (this.user) {
            return this.user;
        }

        const user = await this.getUserInfo();

        if (user) {
            const profile_info = await firstValueFrom(
                this.angularFirestore.collection('users').doc<User>(user.uid).valueChanges()
            );

            return profile_info;
        }

        return undefined;
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
                [], [], []
            );

            this.angularFirestore.collection('users').doc(user.uid).set(new_user.asObject());
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

        // Get rid of properties not needed
        delete anime.links;
        delete anime.relationships;

        if (user?.uid) {
            const record: User | undefined = await firstValueFrom(
                this.angularFirestore.collection('users').doc<User>(user.uid).valueChanges()
            );

            if (record) {
                let found = false;
                for(let i = 0; i < record.anime_list.length; i++) {
                    const el = record.anime_list[i];

                    if (el.id === anime.id) {
                        el.watch_type = 'completed';
                        found = true;
                        break;
                    }
                }

                if (found) {
                    this.toastr.success('The anime watch state has been updated to completed!', 'Anime Watch State Updated');
                } else {
                    anime.watch_type = 'completed';
                    record.anime_list.push(anime);
                    this.toastr.success('The anime has been added to your completed list!', 'Anime Completed');
                }

                this.user = record;
                this.angularFirestore.collection('users').doc(user.uid).set(record);

                return;
            }

            return;
        }

        this.toastr.error('This action could not be completed because no account could be found.', 'No Account found');
    }
}
