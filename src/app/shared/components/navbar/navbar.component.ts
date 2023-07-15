import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';

import { Subscription, map } from 'rxjs';

import { AuthService } from '@shared/services/auth.service';
import { AnimeService } from '@shared/services/anime.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
    public isAuthenticated!: boolean;
    public search = new FormControl('');

    private auth_sub?: Subscription;

    constructor(
        private authService: AuthService,
        private animeService: AnimeService,
        private router: Router
    ) { }

    public ngOnInit(): void {
        this.auth_sub = this.authService.getAuthStream()
            .pipe(
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

    public onSearch(event?: KeyboardEvent) {
        const value = this.search.value;

        if (event instanceof KeyboardEvent) {
            if (event.key === 'Enter') {
                if (value && value !== '') {
                    this.animeService.setSearchPhrase(value);
                    this.router.navigate(['/search', value]);
                }
            }
        } else {
            if (value && value !== '') {
                this.animeService.setSearchPhrase(value);
                this.router.navigate(['/search', value]);
            }
        }
    }
}
