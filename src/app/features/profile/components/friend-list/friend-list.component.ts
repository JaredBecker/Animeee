import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription, firstValueFrom, switchMap } from 'rxjs';

import { Friend } from '@shared/models/friend.interface';
import { UserService } from '@shared/services/user.service';
import { User } from '@shared/models/user.model';

@Component({
    selector: 'app-friend-list',
    templateUrl: './friend-list.component.html',
    styleUrls: ['./friend-list.component.scss']
})
export class FriendListComponent implements OnInit, OnDestroy {
    public friends: Friend[] = [];
    public is_loading: boolean = true;
    public is_viewing: boolean = false;
    public current_user: User | undefined;

    private route_subscription?: Subscription;

    constructor(
        private userService: UserService,
        private activatedRoute: ActivatedRoute,
    ) { }

    public ngOnInit(): void {
        this.route_subscription = this.activatedRoute.paramMap.pipe(
            switchMap(async (params) => {
                this.current_user = undefined;
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
            next: async (user_info) => {
                if (user_info) {
                    if (this.is_viewing) {
                        this.current_user = await firstValueFrom(this.userService.getUserStream());
                    }

                    this.friends = user_info.friend_list;
                    this.is_loading = false;
                }
            },
            error: () => this.is_loading = false,
        })
    }

    public ngOnDestroy(): void {
        this.route_subscription?.unsubscribe();
    }

    public onRemoveFriend(username: string) {
        this.userService.removeFriend(username);
    }
}
