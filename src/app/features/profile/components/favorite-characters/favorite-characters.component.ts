import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription, switchMap } from 'rxjs';

import { UserService } from '@shared/services/user.service';

@Component({
    selector: 'app-favorite-characters',
    templateUrl: './favorite-characters.component.html',
    styleUrls: ['./favorite-characters.component.scss']
})
export class FavoriteCharactersComponent implements OnInit, OnDestroy {
    public favorite_characters: any[] = [];
    public is_loading: boolean = true;
    public is_viewing: boolean = false;

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

                if (username) {
                    this.is_viewing = true;

                    return this.userService.getViewUserStream();
                } else {
                    this.is_viewing = false;

                    return this.userService.getUserStream();
                }
            }),
            switchMap(user => user),
        )
        .subscribe({
            next: (user_info) => {
                if (user_info) {
                    this.favorite_characters = user_info?.favorite_characters;

                }

                this.is_loading = false;
            },
            error: () => this.is_loading = false,
        });
    }

    public ngOnDestroy(): void {
        this.route_subscription?.unsubscribe();
    }
}
