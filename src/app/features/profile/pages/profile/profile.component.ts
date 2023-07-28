import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { UserService } from '@shared/services/user.service';
import { User } from '@shared/models/user.interface';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
    public user: User | undefined;

    public completed: number = 0;
    public on_hold: number = 0;
    public want_to_watch: number = 0;
    public currently_watching: number = 0;

    constructor(
        private userService: UserService,
        private titleService: Title,
    ) {
        this.titleService.setTitle(`Animeee | Profile`);
    }

    public ngOnInit(): void {
        this.userService.getUserProfileInfo()
            .then((user_info) => {
                if (user_info) {
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
                    })
                }
            })
    }
}
