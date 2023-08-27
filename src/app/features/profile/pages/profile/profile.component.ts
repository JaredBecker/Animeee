import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { Subscription, switchMap } from 'rxjs';

import { ToastrService } from 'ngx-toastr';

import { UserService } from '@shared/services/user.service';
import { User } from '@shared/models/user.interface';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
    public user: User | undefined;
    public username: string | undefined;
    public viewing_profile: boolean = false;

    public completed: number = 0;
    public on_hold: number = 0;
    public want_to_watch: number = 0;
    public currently_watching: number = 0;
    public must_watch: number = 0;
    public favorite_characters: number = 0;
    public friend_list: number = 0;

    private route_subscription?: Subscription;

    constructor(
        private userService: UserService,
        private titleService: Title,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private toastr: ToastrService,
    ) {
        this.titleService.setTitle(`Animeee | Profile`);
    }

    public ngOnInit(): void {
        this.route_subscription = this.activatedRoute.paramMap.pipe(
            switchMap(async (params) => {
                const username = params.get('username');

                if (username) {
                    this.viewing_profile = true;
                    this.username = username;
                    await this.userService.getViewingProfile(username);

                    return this.userService.getViewUserStream();
                } else {
                    this.viewing_profile = false;
                    this.username = undefined;

                    return this.userService.getUserStream();
                }
            }),
            switchMap(user => user),
        )
        .subscribe({
            next: (user) => {
                this.resetAnimeCounts();

                if (user) {
                    this.user = user;
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

                    this.favorite_characters = user.favorite_characters.length;
                    this.friend_list = user.friend_list.length;
                } else {
                    this.router.navigateByUrl('/');
                    this.toastr.error('The user you are looking for could not be found', 'No User Found');
                }
            }
        });
    }

    public ngOnDestroy(): void {
        this.route_subscription?.unsubscribe();
    }

    private resetAnimeCounts() {
        this.completed = 0;
        this.on_hold = 0;
        this.want_to_watch = 0;
        this.currently_watching = 0;
    }
}
