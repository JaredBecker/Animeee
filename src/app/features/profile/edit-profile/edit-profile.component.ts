import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
    selector: 'app-edit-profile',
    templateUrl: './edit-profile.component.html',
    styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent {
    @ViewChild('profile_pic_input') public profile_pic_input!: ElementRef;
    public profile_form: FormGroup;
    public img_preview: string = '';

    constructor(
        private formBuilder: FormBuilder,
    ) {
        this.profile_form = this.formBuilder.group({
            email: ['', [Validators.email, Validators.required]],
            username: ['', [Validators.required, Validators.maxLength(25), Validators.maxLength(3)]],
            profile_picture: [null],
        })
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
            console.log('in');
        } else {
            console.log('fuck');
        }
    }

    public onSubmit() {
        console.log(this.profile_form);
    }
}
