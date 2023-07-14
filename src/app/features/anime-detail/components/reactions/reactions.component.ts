import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

import { AnimeService } from '@shared/services/anime.service';
import { AnimeDetailService } from '@shared/services/anime-detail.service';
import { ReactionType } from '@shared/models/Reaction.type';

@Component({
  selector: 'app-reactions',
  templateUrl: './reactions.component.html',
  styleUrls: ['./reactions.component.scss']
})
export class ReactionsComponent implements OnInit, OnDestroy {
    public selected_sort_type: ReactionType = 'popular';
    public reactions: any[] = [];

    private reaction_subscription?: Subscription;

    constructor(
        private animeService: AnimeService,
        private animeDetailService: AnimeDetailService
    ) { }

    public ngOnInit(): void {
        const anime = this.animeDetailService.getCurrentAnime();

        if (anime) {
            this.reaction_subscription = this.animeService.getReactions(anime.id, this.selected_sort_type, 10).subscribe({
                next: (reactions) => {
                    const reaction_array = [];

                    // I can't believe this is how I need to build the relationships between post and user...
                    for(let i = 0; i < 10; i++) {
                        const reaction = reactions.data[i]
                    }
                },
                error: err => console.error('Error fetching reactions', err),
            })
        }
    }

    public ngOnDestroy(): void {
        this.reaction_subscription?.unsubscribe();
    }

    public updateSortType(value: ReactionType) {
        this.selected_sort_type = value;
    }
}
