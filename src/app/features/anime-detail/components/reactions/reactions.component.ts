import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription, filter, switchMap } from 'rxjs';

import { AnimeDetailService } from '@shared/services/anime-detail.service';
import { ReactionType } from '@shared/models/reaction.type';

@Component({
    selector: 'app-reactions',
    templateUrl: './reactions.component.html',
    styleUrls: ['./reactions.component.scss']
})
export class ReactionsComponent implements OnInit, OnDestroy {
    public reaction_type: ReactionType = 'popular';
    public reactions: any[] = [];
    public is_loading: boolean = true;
    public anime!: any;

    private reaction_subscription?: Subscription;
    private anime_subscription?: Subscription;

    constructor(
        private animeDetailService: AnimeDetailService,
    ) {}

    public ngOnInit(): void {
        this.anime_subscription = this.animeDetailService.getCurrentAnime()
            .pipe(
                filter((anime) => anime !== null),
                switchMap((anime: any) => {
                    this.anime = anime;

                    return this.animeDetailService.getReactionStream();
                }),
                switchMap((reactions: any) => reactions),
            )
            .subscribe({
                next: (reactions: any) => {
                    if (reactions.data.length > 0) {
                        /**
                         * I can't believe this is how I need to build the relationships between post and user...
                         * Post is under .data prop
                         * User is under .included prop
                         * They are linked via the indexes... like wtf even .data[0] is a post by user .included[0]
                         * If this structure changes... Ima cry because everything will need to change...
                         */
                        const reaction_array = [];
                        const len = reactions?.included?.length ?? 10
                        for (let i = 0; i < len; i++) {
                            let reaction = reactions.data[i];
                            let user = reactions.included ? reactions.included[i] : undefined;

                            reaction.userInfo = user;
                            reaction_array.push(reaction);
                        }

                        this.reactions = reaction_array;
                    }

                    this.is_loading = false;
                },
                error: (err: any) => {
                    console.error('Error fetching reactions', err);
                    this.is_loading = false;
                },
            });
    }

    public ngOnDestroy(): void {
        this.reaction_subscription?.unsubscribe();
        this.anime_subscription?.unsubscribe();
    }

    public updateSortType(value: ReactionType) {
        this.is_loading = true;
        this.reaction_type = value;

        let media_type: 'Anime' | 'Manga' = this.anime.type === 'anime' ? 'Anime' : 'Manga';
        this.animeDetailService.setReactionType(media_type, value);
    }
}
