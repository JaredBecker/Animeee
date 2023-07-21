import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription, filter, switchMap } from 'rxjs';

import { AnimeService } from '@shared/services/anime.service';
import { AnimeDetailService } from '@shared/services/anime-detail.service';

@Component({
    selector: 'app-related-categories',
    templateUrl: './related-categories.component.html',
    styleUrls: ['./related-categories.component.scss']
})
export class RelatedCategoriesComponent implements OnInit, OnDestroy {
    public categories!: any[];
    public is_loading: boolean = true;

    private anime_subscription?: Subscription;

    constructor(
        private animeService: AnimeService,
        private animeDetailService: AnimeDetailService,
    ) { }

    public ngOnInit(): void {
        this.anime_subscription = this.animeDetailService.getCurrentAnime()
            .pipe(
                filter(anime => anime !== null),
                switchMap((anime: any) => {
                    const url = anime.relationships.categories.links.related;

                    return this.animeService.getCategories(url);
                })
            )
            .subscribe({
                next: (categories: any) => {
                    this.categories = categories.data;
                    this.categories = this.categories?.sort((a: any, b: any) => {
                        if (a.attributes.title < b.attributes.title) {
                            return -1;
                        } else if (a.attributes.title > b.attributes.title) {
                            return 1
                        } else {
                            return 0;
                        }
                    });
                    this.is_loading = false;
                },
                error: (err: any) => {
                    this.is_loading = false;
                    console.error('Error fetching related categories', err);
                }
            })
    }

    public ngOnDestroy(): void {
        this.anime_subscription?.unsubscribe();
    }
}
