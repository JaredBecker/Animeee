import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription, switchMap } from 'rxjs';

// import { ToastrService } from 'ngx-toastr';

import { UserService } from '@shared/services/user.service';

@Component({
  selector: 'app-completed',
  templateUrl: './completed.component.html',
  styleUrls: ['./completed.component.scss']
})
export class CompletedComponent implements OnInit, OnDestroy {
    public animes: any[] = [];
    public is_loading: boolean = true;

    private user_subscription?: Subscription;
    private route_subscription?: Subscription;

    constructor(
        private userService: UserService,
        private activatedRoute: ActivatedRoute,
        // private toastr: ToastrService,
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
                        if (anime.watch_type === 'completed') {
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

        // this.user_subscription = this.userService.getUserStream()
        //     .subscribe({
        //         next: (user_info) => {
        //             if (user_info) {
        //                 this.animes = [];

        //                 user_info?.anime_list.forEach(anime => {
        //                     if (anime.watch_type === 'completed') {
        //                         this.animes.push(anime);
        //                     }
        //                 });
        //             }

        //             this.is_loading = false;
        //         },
        //         error: () => {
        //             this.is_loading = false;
        //         }
        //     });
    }

    public ngOnDestroy(): void {
        this.user_subscription?.unsubscribe();
        this.route_subscription?.unsubscribe();
    }

    public onRemoveAnime(anime_id: string) {
        this.userService.removeAnime(anime_id);
    }
}
