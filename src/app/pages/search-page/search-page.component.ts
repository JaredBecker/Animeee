import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';

import { Subscription, map, switchMap } from 'rxjs';

import { AnimeService } from '@shared/services/anime.service';

@Component({
    selector: 'app-search-page',
    templateUrl: './search-page.component.html',
    styleUrls: ['./search-page.component.scss']
})
export class SearchPageComponent implements OnInit, OnDestroy {
    public search_phrase?: string;
    public search_type: string = 'anime';
    public search_input = new FormControl('');
    public animes: any[] = [];
    public is_loading: boolean = true;

    private search_subscription?: Subscription;
    private route_subscription?: Subscription;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private animeService: AnimeService,
    ) { }

    public ngOnInit(): void {
        /**
         * First listen to search stream then fire off call in subscription below.
         * Needs to be in this order or it doesn't work on load
         */
        this.search_subscription = this.animeService.getSearchStream()
            .pipe(
                switchMap(stream => stream)
            )
            .subscribe({
                next: async (search_results) => {
                    const search_phrase = await this.animeService.getSearchPhrase();
                    this.router.navigate(['/search', search_phrase]);

                    if (search_results.data.length > 0) {
                        this.animes = search_results.data;
                    }

                    this.is_loading = false;
                    console.log(search_results);
                },
                error: (err) => {
                    console.error('Error fetching search results', err);
                    this.is_loading = false;
                }
            })

        this.route_subscription = this.activatedRoute.paramMap
            .pipe(
                map(params => params),
            )
            .subscribe({
                next: params => {
                    this.search_phrase = params.get('search-phrase') ?? '';

                    if (this.search_phrase !== '') {
                        this.animeService.setSearchPhrase(this.search_phrase);
                    }
                },
                error: err => console.error('Error getting params on search page', err),
            })
    }

    public ngOnDestroy(): void {
        this.search_subscription?.unsubscribe();
        this.route_subscription?.unsubscribe();
    }

    public onUpdateSearchType(type: string) {
        this.search_type = type;
    }
}
