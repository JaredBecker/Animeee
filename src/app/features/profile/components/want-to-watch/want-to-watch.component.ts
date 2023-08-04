import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

import { UserService } from '@shared/services/user.service';

@Component({
  selector: 'app-want-to-watch',
  templateUrl: './want-to-watch.component.html',
  styleUrls: ['./want-to-watch.component.scss']
})
export class WantToWatchComponent implements OnInit, OnDestroy {
    public animes: any[] = [];
    public is_loading: boolean = true;

    private user_subscription?: Subscription;

    constructor(
        private userService: UserService,
    ) { }

    public ngOnInit(): void {
        this.is_loading = true;

        this.user_subscription = this.userService.getUserStream()
            .subscribe({
                next: (user_info) => {
                    if (user_info) {
                        this.animes = [];

                        user_info?.anime_list.forEach(anime => {
                            if (anime.watch_type === 'want_to_watch') {
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
    }

    public onRemoveAnime(anime_id: string) {
        this.userService.removeAnime(anime_id);
    }
}