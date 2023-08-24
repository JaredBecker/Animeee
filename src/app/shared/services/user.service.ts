import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { BehaviorSubject, Observable, firstValueFrom, map } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { User } from '@shared/models/user.interface';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private $user_stream: BehaviorSubject<User | undefined> = new BehaviorSubject<User | undefined>(undefined);
    private $user_search_results: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);

    constructor(
        private angularFirestore: AngularFirestore,
        private angularFireAuth: AngularFireAuth,
        private toastr: ToastrService,
    ) {
        this.getUserInfo()
            .then(user => user)
            .then((user) => {
                if (user) {
                    firstValueFrom(this.angularFirestore.collection('users').doc<User>(user.uid).valueChanges())
                        .then((user_profile) => {
                            if (user_profile) {
                                this.$user_stream.next(user_profile);
                            }
                        })
                }
            });
    }

    /**
     * Gets the info of the current user (Firebase info). Also handles setting email verification when fetching data
     *
     * @returns User info or null
     */
    public getUserInfo() {
        const user = firstValueFrom(
            this.angularFireAuth.user.pipe(
                map(user => user)
            )
        );

        return user;
    }

    /**
     * Gets the current user stream
     *
     * @returns User stream
     */
    public getUserStream(): Observable<User | undefined> {
        return this.$user_stream.asObservable();
    }

    /**
     * Get the user search stream
     *
     * @returns User search stream
     */
    public getUserSearchStream(): Observable<User[]> {
        return this.$user_search_results.asObservable();
    }

    /**
     * Updates the user stream with the provided user
     *
     * @param user User info to update the stream with
     */
    public updateUserStream(user: User | undefined): void {
        this.$user_stream.next(user);
    }

    public updateUserSearchStream(users: User[]) {
        this.$user_search_results.next(users);
    }

    /**
     * Get the info for the user profile stored in firestore database
     *
     * @returns User
     */
    public async getUserProfileInfo(): Promise<User | undefined> {
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
     * Looks for users usernames, emails, matching the provided search time
     *
     * @param search_value The email or username to look for
     *
     * @returns User array
     */
    public async searchUsersCollection(search_value: string): Promise<void> {
        const users = await firstValueFrom(
            this.angularFirestore.collection<User>('users', (ref) => ref).valueChanges()
        )
        .then(users => {
            const filtered_users = users.filter((user: User) => {
                const email = user.email.toLowerCase().includes(search_value.toLowerCase());
                const username = user.username.toLowerCase().includes(search_value.toLowerCase());

                return email || username;
            });

            return filtered_users;
        })

        this.updateUserSearchStream(users.length > 0 ? users : []);
    }

    /**
     * Takes a user response from firebase and create a document inside user collection
     *
     * @param user User response from signing up / logging in
     */
    public createNewUserRecord(user: any) {
        if (user) {
            const profile_pic = `${Math.ceil(Math.random() * 12)}.jpg`;
            const username = user.displayName !== '' ? user.email.split('@')[0] : user.displayName;
            const new_user = new User(
                user.uid,
                user.email,
                username,
                profile_pic,
                user.emailVerified,
                [], [], []
            );

            this.angularFirestore.collection('users').doc(user.uid).set(new_user.asObject());
            this.updateUserStream(new_user);
        }
    }

    /**
     * Checks if a users email exists in the database
     *
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
        const found = await this.updateWatchState(anime, 'completed');

        if (found) {
            this.toastr.success('The anime watch state has been updated to completed!', 'Anime Watch State Updated');
        } else {
            this.toastr.success('The anime has been added to your completed list!', 'Anime Completed');
        }
    }

    /**
     * Add anime to user want to watch list
     *
     * @param anime Anime details to add
     *
     * @return void
     */
    public async addToWantToWatch(anime: any): Promise<void> {
        const found = await this.updateWatchState(anime, 'want_to_watch');

        if (found) {
            this.toastr.success('The anime watch state has been updated to want to watch!', 'Anime Watch State Updated');
        } else {
            this.toastr.success('The anime has been added to your want to watch list!', 'Want To Watch Anime');
        }
    }

    /**
     * Add anime to user watching list
     *
     * @param anime Anime details to add
     *
     * @return void
     */
    public async addToWatching(anime: any): Promise<void> {
        const found = await this.updateWatchState(anime, 'currently_watching');

        if (found) {
            this.toastr.success('The anime watch state has been updated to watching!', 'Anime Watch State Updated');
        } else {
            this.toastr.success('The anime has been added to your watching list!', 'Watching Anime');
        }
    }

    /**
     * Add anime to user on hold list
     *
     * @param anime Anime details to add
     *
     * @return void
     */
    public async addToOnHold(anime: any): Promise<void> {
        const found = await this.updateWatchState(anime, 'on_hold');

        if (found) {
            this.toastr.success('The anime watch state has been updated to on hold!', 'Anime Watch State Updated');
        } else {
            this.toastr.success('The anime has been added to your on hold list!', 'Anime On Hold');
        }
    }

    /**
     * Adds anime to must watch list
     *
     * @param anime The anime to add
     *
     * @returns void
     */
    public async addToMustWatch(anime: any): Promise<void> {
        const found = await this.updateWatchState(anime, '', true);

        if (found) {
            this.toastr.success('The anime has been updated to must watch!', 'Update to Must Watch');
        } else {
            this.toastr.success('The anime has been added to your on must watch list!', 'Added To Must Watch');
        }
    }

    /**
     * Adds a character to users favorite character list
     *
     * @param character The character to be added
     *
     * @returns void
     */
    public async addFavoriteCharacter(character: any): Promise<void> {
        const found = await this.updateCharacterList(character);

        if (found) {
            this.toastr.success('Seems you\'ve already added this one.', 'Already in Favorites');
        } else {
            this.toastr.success('The character has been added to your favorites list!', 'Character Added');
        }
    }

    /**
     * Remove an anime from users anime list
     *
     * @param anime_id ID of the anime to remove
     *
     * @returns void
     */
    public async removeAnime(anime_id: string): Promise<void> {
        const user = await this.getUserInfo();

        if (user?.uid) {
            const record: User | undefined = await firstValueFrom(
                this.angularFirestore.collection('users').doc<User>(user.uid).valueChanges()
            );

            if (record) {
                record.anime_list = record.anime_list.filter(el => el.id !== anime_id);
                this.$user_stream.next(record);
                this.angularFirestore.collection('users').doc(user.uid).set(record);
                this.toastr.success('The anime has been removed from your list!', 'Anime Removed');
            }

            return;
        }

        this.toastr.error('This action could not be completed because no account could be found.', 'No Account found');
    }

    /**
     * Remove a character from users favorite character list
     *
     * @param character_id ID of the character to remove
     *
     * @returns void
     */
    public async removeFavoriteCharacter(character_id: string): Promise<void> {
        const user = await this.getUserInfo();

        if (user?.uid) {
            const record: User | undefined = await firstValueFrom(
                this.angularFirestore.collection('users').doc<User>(user.uid).valueChanges()
            );

            if (record) {
                record.favorite_characters = record.favorite_characters.filter(el => el.id !== character_id);
                this.$user_stream.next(record);
                this.angularFirestore.collection('users').doc(user.uid).set(record);
                this.toastr.success('The character has been removed from your list!', 'Character Removed');
            }

            return;
        }

        this.toastr.error('This action could not be completed because no account could be found.', 'No Account found');
    }

    /**
     * Update user info
     *
     * @param user Updated user info to save to firebase
     *
     * @returns void
     */
    public async updateUserInfo(user: User): Promise<void> {
        if (!user.uid) {
            return
        }

        const record: User | undefined = await firstValueFrom(
            this.angularFirestore.collection('users').doc<User>(user.uid).valueChanges()
        );

        if (record) {
            if (user.username !== '') {
                record.username = user.username;
            }

            if (user.profile_picture !== '') {
                record.profile_picture = user.profile_picture;
            }

            this.$user_stream.next(record);
            this.angularFirestore.collection('users').doc(user.uid).set(record);

            this.toastr.success('Your account info has been updated!', 'Profile Updated');
        } else {
            this.toastr.error('This action could not be completed because no user details could be found in the database.', 'No User Found');
        }
    }

    /**
     * Update the user record and sets the selected animes watch state to the provided state
     *
     * @param record User record from the firestore DB
     * @param anime_id ID of the anime to update
     * @param watch_state The watch state to update to
     *
     * @return Boolean indicating if the anime was found and updated
     */
    public async updateWatchState(anime: any, watch_state: string, must_watch: boolean = false) {
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
                for (let i = 0; i < record.anime_list.length; i++) {
                    const el = record.anime_list[i];

                    if (el.id === anime.id) {
                        if (must_watch) {
                            el.must_watch = must_watch;
                        } else {
                            el.watch_type = watch_state;
                        }

                        found = true;
                        break;
                    }
                }

                if (!found) {
                    if (watch_state !== '') {
                        anime.watch_type = watch_state;
                    }

                    anime.must_watch = must_watch;
                    record.anime_list.push(anime);
                }

                this.$user_stream.next(record);
                this.angularFirestore.collection('users').doc(user.uid).set(record);

                return found;
            } else {
                this.toastr.error('This action could not be completed because no user details could be found in the database.', 'No User Found');

                return false;
            }
        }

        this.toastr.error('This action could not be completed because no account could be found.', 'No Account found');

        return false;
    }

    public async updateCharacterList(character: any) {
        const user = await this.getUserInfo();

        delete character.links;
        delete character.relationships;

        if (user?.uid) {
            const record: User | undefined = await firstValueFrom(
                this.angularFirestore.collection('users').doc<User>(user.uid).valueChanges()
            );

            if (record) {
                let found = false;
                for (let i = 0; i < record.favorite_characters.length; i++) {
                    const el = record.favorite_characters[i];

                    if (el.id === character.id) {
                        found = true;
                        break;
                    }
                }

                if (!found) {
                    record.favorite_characters.push(character);
                }

                this.$user_stream.next(record);
                this.angularFirestore.collection('users').doc(user.uid).set(record);

                return found;
            } else {
                this.toastr.error('This action could not be completed because no user details could be found in the database.', 'No User Found');

                return false;
            }
        }

        this.toastr.error('This action could not be completed because no account could be found.', 'No Account found');

        return false;
    }
}
