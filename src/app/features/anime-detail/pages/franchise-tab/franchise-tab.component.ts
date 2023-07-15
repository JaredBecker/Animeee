import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription, switchMap } from 'rxjs';

import { AnimeDetailService } from '@shared/services/anime-detail.service';
import { AnimeService } from '@shared/services/anime.service';

@Component({
    selector: 'app-franchise-tab',
    templateUrl: './franchise-tab.component.html',
    styleUrls: ['./franchise-tab.component.scss']
})
export class FranchiseTabComponent implements OnInit, OnDestroy {
    public franchises: any[] = [];
    public is_loading: boolean = true;

    private franchises_subscription?: Subscription;
    private route_subscription?: Subscription;

    constructor(
        private animeService: AnimeService,
        private animeDetailService: AnimeDetailService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
    ) { }

    public ngOnInit(): void {
        /**
         * Listen to changes in the route so if a user clicks on a franchise poster
         * the content on this page is reloaded because normally it would only
         * run when the page is accessed the first time
         */
        this.franchises_subscription = this.activatedRoute.paramMap
            .pipe(
                switchMap((params) => {
                    this.is_loading = true;
                    const anime_name = params.get('anime-name') ?? '';

                    return this.animeService.getAnime(anime_name)
                }),
                switchMap((anime_details) => {
                    if (anime_details.data.length === 0) {
                        // No resource fround in API
                        this.router.navigateByUrl('/not-found');
                    }

                    const anime = anime_details.data[0];
                    this.animeDetailService.setCurrentAnime(anime);

                    return this.animeService.getFranchise(anime.id);
                })
            )
            .subscribe({
                next: (franchise_res) => {
                    if (franchise_res.included) {
                        // Check that the 2 arrays are the same length to join data
                        if (franchise_res.included.length === franchise_res.data.length) {
                            const len: number = franchise_res.included.length;
                            const shows: any[] = [];

                            for (let i = 0; i < len; i++) {
                                const show = franchise_res.included[i];
                                show.showInfo = franchise_res.data[i];
                                show.showInfo.attributes.role = show.showInfo.attributes.role.replace('_', ' ');
                                shows.push(show);
                            }

                            this.franchises = shows;
                        } else {
                            this.franchises = franchise_res.included;
                        }
                    }

                    this.is_loading = false;
                },
                error: (err) => {
                    console.error('Error fetching franchises stream', err);
                    this.is_loading = false;
                }
            })
    }

    public ngOnDestroy(): void {
        this.franchises_subscription?.unsubscribe();
        this.route_subscription?.unsubscribe();
    }
}
