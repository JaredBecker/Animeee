import { Component, OnDestroy, OnInit } from '@angular/core';

import { BehaviorSubject, Observable, Subscription, map, of, switchMap } from 'rxjs';

import { AnimeService } from '@shared/services/anime.service';
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

    private reaction_subscription?: Subscription;


    constructor(
        private animeDetailService: AnimeDetailService,
    ) {}

    public ngOnInit(): void {
        const anime = this.animeDetailService.getCurrentAnime();

        if (anime) {
            this.reaction_subscription = this.animeDetailService.getReactionStream()
                .pipe(
                    switchMap((reactions) => reactions),
                )
                .subscribe({
                    next: (reactions) => {
                        /**
                         * I can't believe this is how I need to build the relationships between post and user...
                         * Post is under .data prop
                         * User is under .included prop
                         * They are linked via the indexes... like wtf even .data[0] is a post by user .included[0]
                         * If this structure changes... Ima cry because everything will need to change...
                         */
                        const reaction_array = [];

                        for (let i = 0; i < 10; i++) {
                            let reaction = reactions.data[i];
                            let user = reactions.included ? reactions.included[i] : undefined;

                            reaction.userInfo = user;
                            reaction_array.push(reaction);
                        }

                        this.reactions = reaction_array;
                        this.is_loading = false;
                    },
                    error: err => {
                        console.error('Error fetching reactions', err);
                        this.is_loading = false;
                    },
                })
        }
    }

    public ngOnDestroy(): void {
        this.reaction_subscription?.unsubscribe();
    }

    public updateSortType(value: ReactionType) {
        this.is_loading = true;
        this.reaction_type = value;
        this.animeDetailService.setReactionType(value);
    }
}
