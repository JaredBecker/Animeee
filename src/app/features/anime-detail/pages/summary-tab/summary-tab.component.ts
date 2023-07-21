import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription, filter } from 'rxjs';

import { AnimeDetailService } from '@shared/services/anime-detail.service';

@Component({
  selector: 'app-summary-tab',
  templateUrl: './summary-tab.component.html',
  styleUrls: ['./summary-tab.component.scss']
})
export class SummaryTabComponent implements OnInit, OnDestroy {
    public anime!: any;
    public loading_anime: boolean = true;

    private anime_subscription?: Subscription;

    constructor(private animeDetailService: AnimeDetailService) { }

    public ngOnInit(): void {
        this.anime_subscription = this.animeDetailService.getCurrentAnime()
            .pipe(
                filter(anime => anime !== null)
            )
            .subscribe({
                next: (anime: any) => {
                    this.anime = anime;
                    this.loading_anime = false;
                },
                error: (err: any) => {
                    this.loading_anime = false;
                    console.error('Failed getting anime in summary tab', err);
                }
            })

    }

    public ngOnDestroy(): void {
        this.anime_subscription?.unsubscribe();
    }
}
