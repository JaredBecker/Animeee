import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

import { UserService } from '@shared/services/user.service';

@Component({
  selector: 'app-favorite-characters',
  templateUrl: './favorite-characters.component.html',
  styleUrls: ['./favorite-characters.component.scss']
})
export class FavoriteCharactersComponent implements OnInit, OnDestroy {
    public favorite_characters: any[] = [];
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
                        this.favorite_characters = user_info?.favorite_characters;

                    }

                    this.is_loading = false;
                },
                error: () => this.is_loading = false,
            });
    }

    public ngOnDestroy(): void {
        this.user_subscription?.unsubscribe();
    }
}
