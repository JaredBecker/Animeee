import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

import { AnimeService } from 'src/app/shared/services/anime.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit, OnDestroy {
    @Input() public show_type_links: boolean = false;
    public categories?: any[];
    public is_loading: boolean = true;

    private category_sub?: Subscription;

    constructor(
        private animeService: AnimeService,
    ) {}

    public ngOnInit(): void {
        this.category_sub = this.animeService
            .getAnimeCategories()
            .subscribe((categories) => {
                this.categories = categories.data;
                this.is_loading = false;
            })
    }

    public ngOnDestroy(): void {
        this.category_sub?.unsubscribe();
    }
}
