import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

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
        private animeDetailService: AnimeDetailService,
    ) { }

    public ngOnInit(): void {
        const categories_arr: any = this.animeDetailService.getCategories();

        if (categories_arr) {
            this.categories = categories_arr;
            this.categories = this.categories?.sort((a: any, b: any) => {
                if (a.attributes.title < b.attributes.title) {
                    return -1;
                } else if (a.attributes.title > b.attributes.title) {
                    return 1
                } else {
                    return 0;
                }
            });
        }

        this.is_loading = false;
    }

    public ngOnDestroy(): void {
        this.anime_subscription?.unsubscribe();
    }
}
