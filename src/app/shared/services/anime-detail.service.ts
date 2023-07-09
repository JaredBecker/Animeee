import { AnimeResponse } from './../models/anime-response.interface';
import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { AnimeService } from './anime.service';

@Injectable({
    providedIn: 'root'
})
export class AnimeDetailService {

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
    public getAnimeSummary(anime_name: string): Observable<AnimeResponse> {
        let loaded_anime: string | null = sessionStorage.getItem('selected-anime');

        if (loaded_anime) {
            let parsed_anime: AnimeResponse = JSON.parse(loaded_anime) as AnimeResponse;
            let slug: string = parsed_anime.data[0].attributes.slug;

            if (slug === anime_name) {
                return of(parsed_anime);
            }
        }

        return this.animeService.getAnime(anime_name);
    }
}
