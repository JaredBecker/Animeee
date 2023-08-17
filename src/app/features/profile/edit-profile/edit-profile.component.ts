import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { User } from '@shared/models/user.interface';
import { UserService } from '@shared/services/user.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-edit-profile',
    templateUrl: './edit-profile.component.html',
    styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit, OnDestroy {
    @ViewChild('profile_pic_input') public profile_pic_input!: ElementRef;
    public profile_form: FormGroup;
    public img_preview: string = '';
    public user?: User;

    private user_subscription?: Subscription;

    constructor(
        private formBuilder: FormBuilder,
        public userService: UserService
    ) {
        this.profile_form = this.formBuilder.group({
            username: ['', [Validators.required, Validators.maxLength(25), Validators.minLength(3)]],
            profile_picture: [null],
        })
    }

    public ngOnInit(): void {
        this.user_subscription = this.userService.getUserStream().subscribe({
            next: (user: User | undefined) => {
                if (user) {
                    this.user = user;
                    console.log(this.user);

                    this.profile_form.patchValue({
                        email: this.user.email,
                        username: this.user.username,
                    })
                }
            },
            error: (err) => console.log('Error loading user info', err)
        })
    }

    public ngOnDestroy(): void {
        this.user_subscription?.unsubscribe();
    }

    public onUploadProfileImage(event: Event) {
        const input = event.target as HTMLInputElement;

        if (input.files && input.files.length > 0) {
            this.profile_form.patchValue({
                profile_picture: input.files[0]
            });
            console.log(input.files[0]);

            const profile_pic = this.profile_form.get('profile_picture');

            if (profile_pic) {
                profile_pic.updateValueAndValidity();
                // File Preview
                const reader = new FileReader();
                reader.onload = () => {
                    this.img_preview = reader.result as string;
                }

                reader.readAsDataURL(input.files[0])
            }
        } else {
            console.log('no image uploaded');
        }
    }

    public removeSelectedImage() {
        if (this.profile_pic_input) {
            this.profile_pic_input.nativeElement.value = '';
            this.img_preview = '';
        }
    }

    public onSubmit() {
        console.log(this.profile_form);

        if (this.profile_form.status === 'VALID') {
            const profile_pic = this.profile_form.get('profile_picture');
            const username = this.profile_form.get('username');

            if (this.user) {
                if (profile_pic) {
                    // TODO: figure out how to load this image to storage ion firebase
                    // For now will just put it in profile pic but don't think thats going to work
                    this.user.profile_picture = profile_pic.value;
                }

                if (username) {
                    if (username.value !== this.user.username) {
                        this.user.username = username.value;
                    }
                }

                this.userService.updateUserInfo(this.user.uid, this.user.username);
            }
        }

    }
}
