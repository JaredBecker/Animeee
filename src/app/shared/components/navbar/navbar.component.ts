import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';

import {
    Subscription,
    debounceTime,
    distinctUntilChanged,
    map,
} from 'rxjs';

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
    private search_subscription?: Subscription;

    constructor(
        private authService: AuthService,
        private animeService: AnimeService,
        private router: Router
    ) { }

    public ngOnInit(): void {
        this.search_subscription = this.search.valueChanges
            .pipe(
                debounceTime(350),
                distinctUntilChanged(),
            )
            .subscribe({
                next: (search) => {
                    if (search !== '' && search) {
                        this.animeService.setSearchPhrase(search);

                        if (!location.pathname.includes('/search')) {
                            this.router.navigate(['/search', search])
                        }
                    }
                }
            })


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
        this.search_subscription?.unsubscribe();
    }

    public onLogout(): void {
        this.authService.signOut();
    }
}
