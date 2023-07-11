import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, map } from 'rxjs';

import { AuthService } from '@shared/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
    public isAuthenticated!: boolean;

    private auth_sub?: Subscription;

    constructor(private authService: AuthService) {}

    public ngOnInit(): void {
        this.auth_sub = this.authService.getAuthStream().pipe(
            map(isLoggedIn => isLoggedIn)
        )
        .subscribe({
            next: (isLoggedIn) => this.isAuthenticated = isLoggedIn,
            error: (err) => console.error('Error in auth stream', err)
        })
    }

    public ngOnDestroy(): void {
        this.auth_sub?.unsubscribe();
    }

    public onLogout(): void {
        this.authService.signOut();
    }
}
