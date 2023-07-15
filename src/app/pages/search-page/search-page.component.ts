import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';

import {
    Subscription,
    debounceTime,
    distinctUntilChanged,
    map,
    switchMap
} from 'rxjs';

import { AnimeService } from '@shared/services/anime.service';

@Component({
    selector: 'app-search-page',
    templateUrl: './search-page.component.html',
    styleUrls: ['./search-page.component.scss']
})
export class SearchPageComponent implements OnInit, OnDestroy {
    public animes: any[] = [];
    public search_phrase?: string;
    public is_loading: boolean = true;
    public search_type: string = 'anime';
    public search_input: FormControl<string | null> = new FormControl('');

    private search_input_subscription?: Subscription;
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
                next: (search_results) => {
                    if (search_results.data.length > 0) {
                        this.animes = search_results.data;
                    }

                    this.is_loading = false;
                },
                error: (err) => {
                    this.is_loading = false;
                    console.error('Error fetching search results', err);
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
                        // Checking if it should be manga or anime
                        this.setSearchPhrase(this.search_phrase);
                        this.search_input.setValue(this.search_phrase);
                    } else {
                        // No search param so just show no results
                        this.is_loading = false;
                    }
                },
                error: err => {
                    this.is_loading = false;
                    console.error('Error getting params on search page', err);
                },
            })

        this.search_input_subscription = this.search_input.valueChanges
            .pipe(
                debounceTime(350),
                distinctUntilChanged(),
                map(value => value),
            )
            .subscribe({
                next: (value) => {
                    if (value && value !== '') {
                        this.search_phrase = value;
                        this.router.navigate(['/search', this.search_phrase]);
                    }
                }
            })
    }

    public ngOnDestroy(): void {
        this.search_subscription?.unsubscribe();
        this.route_subscription?.unsubscribe();
        this.search_input_subscription?.unsubscribe();
    }

    public onUpdateSearchType(type: string): void {
        this.search_type = type;

        if (this.search_phrase && this.search_phrase !== '') {
            this.is_loading = true;
            this.setSearchPhrase(this.search_phrase);
        }
    }

    public setSearchPhrase(value: string): void {
        let type: 'anime' | 'manga';

        if (this.search_type === 'user' || this.search_type === 'anime') {
            type = 'anime';
        } else {
            type = 'manga';
        }

        this.animeService.setSearchPhrase(value, type);
    }
}
