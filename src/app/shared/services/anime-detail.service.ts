import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { AnimeService } from './anime.service';
import { Response } from '@shared/models/response.interface';

@Injectable({
    providedIn: 'root'
})
export class AnimeDetailService {
    private anime: any;
    private categories?: any[];
    private characterInfo?: any[];

    constructor(
        private animeService: AnimeService,
    ) { }

    /**
     * Checks session storage if the anime has
     *
     * @param anime_name Name of the anime to look up
     *
     * @returns The anime in session storage if found or a stream for the anime provided
     */
    public getAnimeSummary(anime_name: string): Observable<Response> {
        let loaded_anime: string | null = sessionStorage.getItem('selected-anime');

        if (loaded_anime) {
            let parsed_anime: Response = JSON.parse(loaded_anime) as Response;
            let slug: string = parsed_anime.data[0].attributes.slug;

            if (slug === anime_name) {
                return of(parsed_anime);
            }
        }

        return this.animeService.getAnime(anime_name);
    }

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
     * Gets the currently selected anime
     *
     * @returns The currently selected anime
     */
    public getCurrentAnime(): any {
        return this.anime;
    }

    /**
     * Sets the currently active anime
     *
     * @param anime Anime response from API call
     */
    public setCurrentAnime(anime: any): void {
        this.anime = anime;
        sessionStorage.setItem('selected-anime', JSON.stringify(anime));
    }

    /**
     * Take the character array and store it
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
    public getCharacters() {
        return this.characterInfo;
    }
}
