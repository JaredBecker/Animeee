import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable, Subject, of } from 'rxjs';

import { AnimeService } from './anime.service';
import { Response } from '@shared/models/response.interface';
import { ReactionType } from '@shared/models/reaction.type';

@Injectable({
    providedIn: 'root'
})
export class AnimeDetailService {
    private anime: any;
    private categories?: any[];
    private characterInfo?: any[];
    private reaction_type: ReactionType = 'popular';


    private $reaction_subject: BehaviorSubject<Observable<Response>> = new BehaviorSubject<Observable<Response>>(of({} as Response));

    constructor(
        private animeService: AnimeService,
    ) {}

    /**
     * Stores the list of related categories for an anime
     *
     * @param categories Array of related categories for the anime
     */
    public setCategories(categories: any[]): void {
        this.categories = categories;
    }

    /**
     * Gets the list of related categories
     *
     * @returns Array of related categories
     */
    public getCategories(): any[] | undefined {
        return this.categories;
    }

    /**
     * Sets the currently active anime
     *
     * @param anime Anime response from API call
     */
    public setCurrentAnime(anime: any): void {
        this.anime = anime;
    }

    /**
     * Gets the currently selected anime
     *
     * @returns The currently selected anime
     */
    public getCurrentAnime(): any {
        return this.anime;
    }

    /**
     * Sets character info
     *
     * @param data Data you get back from getCharacterInfo call in animeService
     */
    public setCharacterInfo(data: any): void {
        this.characterInfo = data;
    }

    /**
     * Retries the currently stored characters
     *
     * @returns Character info
     */
    public getCharacterInfo(): any[] | undefined {
        return this.characterInfo;

    }

    /**
     * Sets the reaction type
     *
     * @param type Reaction type
     */
    public setReactionType(type: ReactionType): void {
        this.reaction_type = type;

        this.$reaction_subject.next(
            this.animeService.getReactions(this.anime.id, this.reaction_type, 10)
        )
    }

    /**
     * Gets the reaction stream
     *
     * @returns Reaction stream
     */
    public getReactionStream(): Observable<Observable<Response>> {
        return this.$reaction_subject.asObservable();
    }
}
