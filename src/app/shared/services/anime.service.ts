import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, shareReplay, throwError } from 'rxjs';

import { AnimeResponse } from '../models/anime-response.interface';
import { CategoryResponse } from '../models/category-response.interface';

@Injectable({
    providedIn: 'root'
})
export class AnimeService {
    private anime_stream_map = new Map<string, Observable<AnimeResponse>>();
    private category_stream_map = new Map<string, Observable<CategoryResponse>>();

    private api: string = 'https://kitsu.io/api/edge';

    constructor(
        private http: HttpClient,
    ) { }

    /**
     * Gets the top 10 trending anime
     *
     * @returns Trending anime stream
     */
    public getTrendingAnime() {
        if (!this.anime_stream_map.has('trending')) {
            this.storeAnimeStream('trending', `${this.api}/trending/anime?limit=10`)
        }

        const $stream = this.anime_stream_map.get('trending');

        if (!$stream) {
            return throwError(() => new Error('No trending anime stream found'));
        }

        return $stream;
    }

    /**
     * Gets the top 10 highest rated anime
     *
     * @returns Highest rated anime stream
     */
    public getHighestRatedAnime() {
        if (!this.anime_stream_map.has('highest_rated')) {
            this.storeAnimeStream('highest_rated', `${this.api}/anime?page[limit]=10&sort=-average_rating`)
        }

        const $stream = this.anime_stream_map.get('highest_rated');

        if (!$stream) {
            return throwError(() => new Error('No highest rated anime stream found'));
        }

        return $stream;
    }

    /**
     * Gets the top 10 top airing anime
     *
     * @returns Top Airing anime stream
     */
    public getTopAiringAnime() {
        if (!this.anime_stream_map.has('top_airing')) {
            this.storeAnimeStream('top_airing', `${this.api}/anime?filter[status]=current&page[limit]=10&sort=-user_count`)
        }

        const $stream = this.anime_stream_map.get('top_airing');

        if (!$stream) {
            return throwError(() => new Error('No top airing anime stream found'));
        }

        return $stream;
    }

    /**
     * Gets the top 10 top airing anime
     *
     * @returns Top Airing anime stream
     */
    public getTopUpcomingAnime() {
        if (!this.anime_stream_map.has('top_upcoming')) {
            this.storeAnimeStream('top_upcoming', `${this.api}/anime?filter[status]=upcoming&page[limit]=10&sort=-user_count`)
        }

        const $stream = this.anime_stream_map.get('top_upcoming');

        if (!$stream) {
            return throwError(() => new Error('No top upcoming anime stream found'));
        }

        return $stream;
    }

    /**
     * Gets the top 10 top airing anime
     *
     * @returns Top Airing anime stream
     */
    public getMostPopularAnime() {
        if (!this.anime_stream_map.has('most_popular')) {
            this.storeAnimeStream('top_upcoming', `${this.api}/anime?page[limit]=10&sort=-user_count`)
        }

        const $stream = this.anime_stream_map.get('top_upcoming');

        if (!$stream) {
            return throwError(() => new Error('No top upcoming anime stream found'));
        }

        return $stream;
    }

    /**
     * Gets the top 40 anime categories
     *
     * @returns Anime categories stream
     */
    public getAnimeCategories(): Observable<CategoryResponse> {
        if (!this.category_stream_map.has('anime_categories')) {
            const $stream = this.http
                .get<AnimeResponse>(`${this.api}/categories?page[limit]=40&sort=-total_media_count`)
                .pipe(
                    shareReplay(1)
                );

            this.category_stream_map.set('anime_categories', $stream);
        }

        const $stream = this.category_stream_map.get('anime_categories');

        if (!$stream) {
            return throwError(() => new Error('No anime categories stream found'));
        }

        return $stream;
    }

    /**
     * Builds an anime request
     *
     * @param url The URL the request needs to be made to
     *
     * @returns Observable of the anime info for the provided request
     */
    private getAnimeStream(url: string): Observable<AnimeResponse> {
        return this.http
            .get<AnimeResponse>(url)
            .pipe(
                shareReplay(1)
            );
    }

    /**
     * Stores an anime stream
     *
     * @param key The key to store the stream under in the hash map
     * @param url The URL of the endpoint to query
     */
    private storeAnimeStream(key: string, url: string) {
        const $anime_stream = this.getAnimeStream(url);
        this.anime_stream_map.set(key, $anime_stream);
    }
}
