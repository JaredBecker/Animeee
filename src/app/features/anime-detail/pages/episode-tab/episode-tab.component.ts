import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

import { AnimeService } from '@shared/services/anime.service';
import { AnimeDetailService } from '@shared/services/anime-detail.service';

@Component({
    selector: 'app-episode-tab',
    templateUrl: './episode-tab.component.html',
    styleUrls: ['./episode-tab.component.scss']
})
export class EpisodeTabComponent implements OnInit, OnDestroy {
    public episodes: any[] = [];
    public is_loading: boolean = true;

    private episode_subscription?: Subscription;

    constructor(
        private animeService: AnimeService,
        private animeDetailService: AnimeDetailService,
    ) { }

    public ngOnInit(): void {
        const anime = this.animeDetailService.getCurrentAnime();

        if (anime) {
            this.episode_subscription = this.animeService.getEpisodes(anime.id)
            .subscribe({
                next: (episode_res) => {
                    if (episode_res.data.length > 0) {
                        this.episodes = episode_res.data;
                    }

                    this.is_loading = false;
                },
                error: (err) => {
                    console.error('Error fetching episode stream', err);
                    this.is_loading = false;
                }
            })
        }
    }

    public ngOnDestroy(): void {
        this.episode_subscription?.unsubscribe();
    }
}
