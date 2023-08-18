import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { Subscription } from 'rxjs';

import { UserService } from '@shared/services/user.service';
import { User } from '@shared/models/user.interface';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
    public user: User | undefined;

    public completed: number = 0;
    public on_hold: number = 0;
    public want_to_watch: number = 0;
    public currently_watching: number = 0;
    public must_watch: number = 0;
    public favorite_characters: number = 0;
    public friend_list: number = 0;

    private user_subscription?: Subscription;

    constructor(
        private userService: UserService,
        private titleService: Title,
    ) {
        this.titleService.setTitle(`Animeee | Profile`);
    }

    public ngOnInit(): void {
        this.user_subscription = this.userService.getUserStream()
            .subscribe({
                next: (user_info) => {
                    console.log(user_info);
                    if (user_info) {
                        this.resetAnimeCounts();
                        this.user = user_info;

                        this.user.anime_list.forEach((anime) => {
                            if (anime.watch_type === 'completed') {
                                this.completed++;
                            }

                            if (anime.watch_type === 'on_hold') {
                                this.on_hold++;
                            }

                            if (anime.watch_type === 'want_to_watch') {
                                this.want_to_watch++;
                            }

                            if (anime.watch_type === 'currently_watching') {
                                this.currently_watching++;
                            }

                            if (anime.must_watch) {
                                this.must_watch++;
                            }
                        });

                        this.favorite_characters = user_info.favorite_characters.length;
                        this.friend_list = user_info.friend_list.length;
                    }
                }
            });
    }

    public ngOnDestroy(): void {
        this.user_subscription?.unsubscribe();
    }

    private resetAnimeCounts() {
        this.completed = 0;
        this.on_hold = 0;
        this.want_to_watch = 0;
        this.currently_watching = 0;
    }
}
