import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';

import {
    Subscription,
    combineLatest,
    debounceTime,
    distinctUntilChanged,
    map,
    switchMap,
    tap,
} from 'rxjs';

import { User } from '@shared/models/user.interface';
import { AnimeService } from '@shared/services/anime.service';
import { AnimeSortType } from '@shared/models/anime-sort-type.interface';
import { UserService } from '@shared/services/user.service';

@Component({
    selector: 'app-search-page',
    templateUrl: './search-page.component.html',
    styleUrls: ['./search-page.component.scss']
})
export class SearchPageComponent implements OnInit, OnDestroy {
    public animes: any[] = [];
    public users: User[] = [];
    public placeholders: any[] = new Array(20);
    public search_phrase?: string;
    public is_loading: boolean = true;
    public loading_more: boolean = false;
    public lookup_type: string = 'anime';
    public current_search_type?: string;
    public search_input: FormControl<string | null> = new FormControl('');
    public more_results_url?: string;

    private search_input_subscription?: Subscription;
    private anime_search_subscription?: Subscription;
    private user_search_subscription?: Subscription;
    private route_subscription?: Subscription;
    private more_results_subscription?: Subscription;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private animeService: AnimeService,
        private titleService: Title,
        private userService: UserService
    ) { }

    public ngOnInit(): void {
        this.lookup_type = sessionStorage.getItem('lookup_type') ?? 'anime';

        /**
         * First listen to search stream then fire off call in subscription below.
         * Needs to be in this order or it doesn't work on load
         */
        this.anime_search_subscription = this.animeService.getSearchStream()
            .pipe(
                tap(() => this.users = []),
                switchMap(stream => stream)
            )
            .subscribe({
                next: (search_results) => {
                    if (search_results.data.length > 0 && this.lookup_type !== 'user') {
                        this.animes = search_results.data;
                        this.more_results_url = search_results?.links?.next && search_results.links.next;
                    } else {
                        this.animes = [];
                        this.more_results_url = undefined;
                    }

                    this.is_loading = false;
                },
                error: (err) => {
                    this.is_loading = false;
                    console.error('Error fetching search results', err);
                }
            });

        this.user_search_subscription = this.userService.getUserSearchStream()
            .pipe(
                tap(() => {
                    this.users = [];
                    this.animes = [];
                    this.more_results_url = undefined;
                }),
            )
            .subscribe({
                next: (users) => {
                    this.users = users;
                    this.is_loading = false;
                },
                error: (err) => {
                    console.error('Failed to lookup users', err);
                    this.is_loading = false;
                }
            })

        this.more_results_subscription = this.animeService.getMoreResultsStream()
            .pipe(
                switchMap(stream => stream)
            )
            .subscribe({
                next: (next_results) => {
                   if (next_results.data.length > 0) {
                        this.animes.push(...next_results.data);
                        this.loading_more = false;
                        this.more_results_url = next_results?.links?.next && next_results.links.next;
                   }
                },
                error: (err) => {
                    this.loading_more = false;
                    console.error('Failed to load more results', err);
                }
            })

        const url_info = combineLatest([
            this.activatedRoute.queryParamMap,
            this.activatedRoute.paramMap,
        ]);

        this.route_subscription = url_info
            .pipe(
                map((url_data) => {
                    this.is_loading = true;
                    this.more_results_url = undefined;

                    const queries = url_data[0];
                    const params = url_data[1];

                    const category = queries.get('category');
                    const type = queries.get('type');
                    const search_phrase = params.get('search-phrase');

                    if (category) {
                        this.lookup_type === 'user' ? 'anime' : this.lookup_type;
                        return { load: 'category', value: category };
                    }

                    if (type) {
                        this.lookup_type === 'user' ? 'anime' : this.lookup_type;
                        return { load: 'type', value: type };
                    }

                    if (search_phrase) {
                        return { load: 'search', value: search_phrase };
                    }

                    return false;
                }),
            )
            .subscribe({
                next: (query_data) => {
                    if (query_data) {
                        this.current_search_type = query_data.load;

                        if (query_data.value && query_data.value !== '') {
                            this.search_phrase = query_data.value;
                            this.titleService.setTitle(`Animeee | ${this.search_phrase.toLocaleUpperCase()}`);
                            this.setSearchPhrase(query_data.value);

                            if (this.current_search_type === 'search') {
                                this.search_input.setValue(this.search_phrase);
                            }
                        }
                    } else {
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
                        sessionStorage.setItem('lookup_type', this.lookup_type);
                        this.router.navigate(['/search', this.search_phrase]);
                    }
                }
            })
    }

    public ngOnDestroy(): void {
        this.anime_search_subscription?.unsubscribe();
        this.user_search_subscription?.unsubscribe();
        this.route_subscription?.unsubscribe();
        this.search_input_subscription?.unsubscribe();
        this.more_results_subscription?.unsubscribe();
    }

    public onUpdateSearchType(type: string): void {
        this.lookup_type = type;
        sessionStorage.setItem('lookup_type', this.lookup_type);

        if (this.search_phrase && this.search_phrase !== '') {
            this.is_loading = true;
            this.setSearchPhrase(this.search_phrase);
        }
    }

    public assertIsAnimeSortType(param: string): asserts param is AnimeSortType {
        if (
            param !== 'trending' &&
            param !== 'top-airing' &&
            param !== 'upcoming' &&
            param !== 'highest-rated' &&
            param !== 'most-popular'
        ) {
            throw new Error(`Invalid AnimeSortType: ${param}`);
        }
    }

    public setSearchPhrase(value: string): void {
        let type = this.getAnimeType();

        if (this.current_search_type === 'category') {
            this.animeService.setCategorySearch(this.search_phrase ?? '', type);
        } else if (this.current_search_type === 'type') {
            const phrase = this.search_phrase as AnimeSortType;

            this.assertIsAnimeSortType(phrase);
            this.animeService.setTypeSearch(phrase, type);
        } else {
            if (this.lookup_type === 'anime' || this.lookup_type === 'manga') {
                this.animeService.setSearchPhrase(value, type);
            } else if (this.lookup_type === 'user') {
                this.userService.searchUsersCollection(value);
            }
        }
    }

    public onLoadMore(): void {
        if (this.more_results_url) {
            this.loading_more = true;
            this.animeService.LoadMoreRequest(this.more_results_url);
        }
    }

    private getAnimeType(): 'anime' | 'manga' {
        let type: 'anime' | 'manga';

        if (this.lookup_type === 'anime') {
            type = 'anime';
        } else {
            type = 'manga';
        }

        return type;
    }
}
