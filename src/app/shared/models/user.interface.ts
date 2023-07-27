export class User {
    public uid: string;
    public email: string;
    public username: string;
    public profile_picture: string = '';
    public email_verified: boolean = false;
    public completed: number[] = [];
    public on_hold: number[] = [];
    public want_to_watch: number[] = [];
    public currently_watching: number[] = [];
    public favorite_characters: number[] = [];
    public friend_list: string[] = [];

    constructor(
        uid: string,
        email: string,
        username: string,
        profile_picture: string,
        email_verified: boolean,
        completed: number[],
        on_hold: number[],
        want_to_watch: number[],
        currently_watching: number[],
        favorite_characters: number[],
        friend_list: string[],
    ) {
        this.uid = uid;
        this.email = email;
        this.username = username;
        this.profile_picture = profile_picture;
        this.email_verified = email_verified;
        this.completed = completed;
        this.on_hold = on_hold;
        this.want_to_watch = want_to_watch;
        this.currently_watching = currently_watching;
        this.favorite_characters = favorite_characters;
        this.friend_list = friend_list;
    }

    /**
     * Get user fields in an object so it can be use to set a document in firebase
     *
     * @returns User as an object
     */
    public asObject() {
        return {
            uid: this.uid,
            email: this.email,
            username: this.username,
            profile_picture: this.profile_picture,
            email_verified: this.email_verified,
            completed: this.completed,
            on_hold: this.on_hold,
            want_to_watch: this.want_to_watch,
            currently_watching: this.currently_watching,
            favorite_characters: this.favorite_characters,
            friend_list: this.friend_list,
        }
    }
}
