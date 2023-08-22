export class User {
    /*
        WATCH TYPES
        - completed
        - on_hold
        - want_to_watch
        - currently_watching
    */

    public uid: string;
    public email: string;
    public username: string;
    public profile_picture: string = '';
    public email_verified: boolean = false;
    public anime_list: any[] = [];
    public favorite_characters: any[] = [];
    public friend_list: string[] = [];

    constructor(
        uid: string,
        email: string,
        username: string,
        profile_picture: string,
        email_verified: boolean,
        anime_list: any[],
        favorite_characters: any[],
        friend_list: string[],
    ) {
        this.uid = uid;
        this.email = email;
        this.username = username;
        this.profile_picture = profile_picture;
        this.email_verified = email_verified;
        this.anime_list = anime_list;
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
            anime_list: this.anime_list,
            favorite_characters: this.favorite_characters,
            friend_list: this.friend_list,
        }
    }
}
