import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription, switchMap } from 'rxjs';

import { Friend } from '@shared/models/friend.interface';
import { UserService } from '@shared/services/user.service';

@Component({
    selector: 'app-friend-list',
    templateUrl: './friend-list.component.html',
    styleUrls: ['./friend-list.component.scss']
})
export class FriendListComponent implements OnInit, OnDestroy {
    public friends: Friend[] = [];
    public is_loading: boolean = true;
    public is_viewing: boolean = false;

    private route_subscription?: Subscription;

    constructor(
        private userService: UserService,
        private activatedRoute: ActivatedRoute,
    ) { }

    public ngOnInit(): void {
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
}
