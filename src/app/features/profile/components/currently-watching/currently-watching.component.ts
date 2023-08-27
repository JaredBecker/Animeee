import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription, switchMap } from 'rxjs';

import { UserService } from '@shared/services/user.service';

@Component({
    selector: 'app-currently-watching',
    templateUrl: './currently-watching.component.html',
    styleUrls: ['./currently-watching.component.scss']
})
export class CurrentlyWatchingComponent implements OnInit, OnDestroy {
    public animes: any[] = [];
    public is_loading: boolean = true;

    private user_subscription?: Subscription;
    private route_subscription?: Subscription;

    constructor(
        private userService: UserService,
        private activatedRoute: ActivatedRoute,
    ) { }

    public ngOnInit(): void {
        this.is_loading = true;

        this.route_subscription = this.activatedRoute.paramMap.pipe(
            switchMap(async (params) => {
                const username = params.get('username');

                return username ? this.userService.getViewUserStream() : this.userService.getUserStream()
            }),
            switchMap(user => user),
        )
        .subscribe({
            next: (user_info) => {
                if (user_info) {
                    this.animes = [];

                    user_info?.anime_list.forEach(anime => {
                        if (anime.watch_type === 'currently_watching') {
                            this.animes.push(anime);
                        }
                    });
                }

                this.is_loading = false;
            },
            error: () => {
                this.is_loading = false;
            }
        });
    }

    public ngOnDestroy(): void {
        this.user_subscription?.unsubscribe();
        this.route_subscription?.unsubscribe();
    }

    public onRemoveAnime(anime_id: string) {
        this.userService.removeAnime(anime_id);
    }
}
