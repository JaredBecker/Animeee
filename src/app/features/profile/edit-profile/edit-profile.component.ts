import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';

import { User } from '@shared/models/user.interface';
import { UserService } from '@shared/services/user.service';

@Component({
    selector: 'app-edit-profile',
    templateUrl: './edit-profile.component.html',
    styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit, OnDestroy {
    public profile_pic: string = '';
    public profile_pic_arr = new Array(12);
    public user?: User;
    public username = new FormControl(
        '',
        [
            Validators.required,
            Validators.maxLength(25),
            Validators.minLength(3),
        ]
    );

    private user_subscription?: Subscription;

    constructor(
        public userService: UserService
    ) { }

    public ngOnInit(): void {
        this.user_subscription = this.userService.getUserStream().subscribe({
            next: (user: User | undefined) => {
                if (user) {
                    this.user = user;
                    this.profile_pic = this.user.profile_picture;
                    this.username.setValue(this.user.username);
                }
            },
            error: (err) => console.error('Error loading user info', err)
        })
    }

    public ngOnDestroy(): void {
        this.user_subscription?.unsubscribe();
    }

    public onSelectProfilePic(index: number) {
        this.profile_pic = `${index + 1}.jpg`;
    }

    public checkEmailVerification() {
        // Hack to get verification check to work because firebase user isn't updated when email verification link is used while logged in... -_-
        window.location.reload();
    }

    public onSubmit() {
        if (this.user) {
            if (this.username.value && this.user?.username !== this.username.value) {
                this.user.username = this.username.value;
            }

            if (this.profile_pic && this.user?.profile_picture !== this.profile_pic) {
                this.user.profile_picture = this.profile_pic;
            }

            this.userService.updateUserInfo(this.user);
        }
    }
}
