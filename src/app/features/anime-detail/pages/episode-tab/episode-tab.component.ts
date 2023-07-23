import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription, filter, switchMap } from 'rxjs';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AnimeService } from '@shared/services/anime.service';
import { AnimeDetailService } from '@shared/services/anime-detail.service';
import { EpisodeModalComponent } from '@shared/components/episode-modal/episode-modal.component';

@Component({
    selector: 'app-episode-tab',
    templateUrl: './episode-tab.component.html',
    styleUrls: ['./episode-tab.component.scss']
})
export class EpisodeTabComponent implements OnInit, OnDestroy {
    public episodes: any[] = [];
    public placeholders: any[] = new Array(10);
    public is_loading: boolean = true;
    public type?: string;

    private anime_subscription?: Subscription;

    constructor(
        private animeService: AnimeService,
        private animeDetailService: AnimeDetailService,
        private modalService: NgbModal,
    ) { }

    public ngOnInit(): void {
        this.anime_subscription = this.animeDetailService.getCurrentAnime()
            .pipe(
                filter(anime => anime !== null),
                switchMap((anime: any) => {
                    if (anime.type === 'manga') {
                        this.type = 'chapters';
                        return this.animeService.getChapters(anime.id);
                    }

                    this.type = 'episodes';
                    return this.animeService.getEpisodes(anime.id)
                })
            )
            .subscribe({
                next: (episode_res: any) => {
                    if (episode_res.data.length > 0) {
                        this.episodes = episode_res.data;
                    }

                    this.is_loading = false;
                },
                error: (err: any) => {
                    console.error('Error fetching episode stream', err);
                    this.is_loading = false;
                }
            });
    }

    public ngOnDestroy(): void {
        this.anime_subscription?.unsubscribe();
    }

    public onSelectEpisode(episode: any) {
        const e = episode.attributes;

        // Make sure that there is some data to display before firing modal
        if (e.canonicalTitle && e?.thumbnail) {
            const modal = this.modalService.open(EpisodeModalComponent);
            modal.componentInstance.episode = episode;
        }
    }
}
