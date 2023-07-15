import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

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

    constructor(
        private animeService: AnimeService,
        private animeDetailService: AnimeDetailService,
    ) {}

    public ngOnInit(): void {
        const anime = this.animeDetailService.getCurrentAnime();

        if (anime) {
            this.franchises_subscription = this.animeService.getFranchise(anime.id)
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
                        console.log(this.franchises);
                        this.is_loading = false;
                    },
                    error: (err) => {
                        console.error('Error fetching franchises stream', err);
                        this.is_loading = false;
                    }
                })
        }
    }

    public ngOnDestroy(): void {
        this.franchises_subscription?.unsubscribe();
    }
}
