import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { BehaviorSubject, Observable, firstValueFrom, map } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { User } from '@shared/models/user.model';
import { Router } from '@angular/router';
import { Friend } from '@shared/models/friend.interface';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private $user_stream: BehaviorSubject<User | undefined> = new BehaviorSubject<User | undefined>(undefined);
    private $viewing_user_stream: BehaviorSubject<User | undefined> = new BehaviorSubject<User | undefined>(undefined);
    private $user_search_results: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);

    constructor(
        private angularFirestore: AngularFirestore,
        private angularFireAuth: AngularFireAuth,
        private toastr: ToastrService,
        private router: Router,
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
     * Gets the stream for the user profile being viewed
     *
     * @returns stream of the user who's profile is being viewed
     */
    public getViewUserStream() {
        return this.$viewing_user_stream.asObservable();
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

    /**
     * Update the found users stream
     *
     * @param users Filtered users
     */
    public updateUserSearchStream(users: User[]): void {
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
     * Gets the profile info for the account the user is viewing
     *
     * @param username The username of the account being viewed
     */
    public async getViewingProfile(username: string): Promise<void> {
        const users = await firstValueFrom(
            this.angularFirestore.collection<User>('users', (ref) => ref.where('username', '==', username)).valueChanges()
        );

        if (users.length === 1) {
            this.$viewing_user_stream.next(users[0]);
        } else {
            this.router.navigate(['/']);
            this.toastr.error(`The user with username ${username} could not be found`, 'No User Found');
        }
    }

    /**
     * Looks for users usernames, emails, matching the provided search time and excludes the currently logged in user
     *
     * @param search_value The email or username to look for
     *
     * @returns User array
     */
    public async searchUsersCollection(search_value: string): Promise<void> {
        const logged_in_user = await firstValueFrom(this.$user_stream);

        const users = await firstValueFrom(
            this.angularFirestore.collection<User>('users').valueChanges()
        )
        .then((users) => {
            const filtered_users = users.filter((user: User) => {
                let current_user = false;
                const email = user.email.toLowerCase().includes(search_value.toLowerCase());
                const username = user.username.toLowerCase().includes(search_value.toLowerCase());

                if (logged_in_user) {
                    current_user = user.uid === logged_in_user.uid;;
                }

                return ((email || username) && !current_user);
            });

            return filtered_users;
        });

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
     * Removes a friend from the users friend list
     *
     * @param username The username of the friend to remove
     *
     * @returns void
     */
    public async removeFriend(username: string): Promise<void> {
        const user = await this.getUserInfo();

        if (user?.uid) {
            const record: User | undefined = await firstValueFrom(
                this.angularFirestore.collection('users').doc<User>(user.uid).valueChanges()
            );

            if (record) {
                record.friend_list = record.friend_list.filter(el => el.username !== username);
                this.$user_stream.next(record);
                this.angularFirestore.collection('users').doc(user.uid).set(record);
                this.toastr.success(`${username} has been removed from your friend list`, 'Friend Removed');
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
    public async updateWatchState(anime: any, watch_state: string, must_watch: boolean = false): Promise<boolean> {
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

    /**
     * Add the selected to character to users fav characters list
     *
     * @param character The character to add to the list
     *
     * @returns Boolean indicating if the friend was found and updated
     */
    public async updateCharacterList(character: any): Promise<boolean> {
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

    /**
     * Adds currently viewed profile to friend list
     */
    public async addFriend(): Promise<void> {
        const user = await this.getUserInfo();

        if (user?.uid) {
            const record: User | undefined = await firstValueFrom(
                this.angularFirestore.collection('users').doc<User>(user.uid).valueChanges()
            );
            const profile_being_viewed = await firstValueFrom(this.getViewUserStream());


            if (record) {
                if (profile_being_viewed) {
                    let found = record.friend_list.some(el => el.username === profile_being_viewed.username);

                    if (!found) {
                        const friend: Friend = {
                            username: profile_being_viewed.username,
                            profile_picture: profile_being_viewed.profile_picture
                        }

                        record.friend_list.push(friend);
                    }

                    this.$user_stream.next(record);
                    await this.angularFirestore.collection('users').doc(user.uid).set(record)
                        .then(() => {
                            if (found) {
                                this.toastr.error(`It seems you are already friends with ${profile_being_viewed.username}.`, 'Already friends');
                            } else {
                                this.toastr.success(`Added ${profile_being_viewed.username} as friend.`, 'Friend Added');
                            }
                        });
                } else {
                    this.toastr.error('The username of the user you are trying to add does not exist.', 'No User Found');
                }
            } else {
                this.toastr.error('This action could not be completed because no user details could be found in the database.', 'No User Found');
            }
        } else {
            this.toastr.error('This action could not be completed because no account could be found.', 'No Account found');
        }
    }
}
