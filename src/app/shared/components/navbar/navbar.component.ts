import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '@shared/services/auth.service';
import { Subscription, map } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
    public is_logged_in: boolean = false;

    private user_logged_in_sub?: Subscription;

    constructor(private authService: AuthService) {}

    public ngOnInit(): void {
        this.user_logged_in_sub = this.authService.isLoggedIn()
            .pipe(
                map(logged_in_state => logged_in_state)
            )
            .subscribe({
                next: logged_in_state => this.is_logged_in = logged_in_state,
                error: err => console.error('Error in auth server logged in check', err),
            })
    }

    public ngOnDestroy(): void {
        this.user_logged_in_sub?.unsubscribe();
    }

    public onLogout() {
        this.authService.signOut();
    }
}
