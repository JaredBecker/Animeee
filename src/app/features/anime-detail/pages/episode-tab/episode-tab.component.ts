import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

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
    public is_loading: boolean = true;

    private episode_subscription?: Subscription;

    constructor(
        private animeService: AnimeService,
        private animeDetailService: AnimeDetailService,
        private modalService: NgbModal,
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

    public onSelectEpisode(episode: any) {
        const e = episode.attributes;

        // Make sure that there is some data to display before firing modal
        if (e.canonicalTitle && e?.thumbnail) {
            const modal = this.modalService.open(EpisodeModalComponent);
            modal.componentInstance.episode = episode;
        }
    }
}
