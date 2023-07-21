import { Component, OnInit } from '@angular/core';
import { AuthService } from '@shared/services/auth.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
    public user: any;

    constructor(private authService: AuthService) { }

    public ngOnInit(): void {
        this.user = this.authService.getUserInfo();
    }
}
