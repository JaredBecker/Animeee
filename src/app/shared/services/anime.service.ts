import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, shareReplay, throwError } from 'rxjs';

import { AnimeResponse } from '../models/anime-response.interface';
import { CategoryResponse } from '../models/category-response.interface';

@Injectable({
    providedIn: 'root'
})
export class AnimeService {
    private api: string = 'https://kitsu.io/api/edge';
    private anime_stream_map = new Map<string, Observable<AnimeResponse>>();
    private category_stream_map = new Map<string, Observable<CategoryResponse>>();

    constructor(private http: HttpClient) { }

    /**
     * Gets the top 10 trending anime
     *
     * @returns Trending anime stream
     */
    public getTrendingAnime() {
        const url = `${this.api}/trending/anime?limit=10`;
        const error = 'No trending anime stream found';
        const $stream = this.checkAnimeStream('trending', url, error);

        return $stream;
    }

    /**
     * Gets the top 10 highest rated anime
     *
     * @returns Highest rated anime stream
     */
    public getHighestRatedAnime() {
        const url = `${this.api}/anime?page[limit]=10&sort=-average_rating`;
        const error = 'No highest rated anime stream found';
        const $stream = this.checkAnimeStream('highest_rated', url, error);

        return $stream;
    }

    /**
     * Gets the top 10 top airing anime
     *
     * @returns Top Airing anime stream
     */
    public getTopAiringAnime() {
        const url = `${this.api}/anime?filter[status]=current&page[limit]=10&sort=-user_count`;
        const error = 'No top airing anime stream found';
        const $stream = this.checkAnimeStream('top_airing', url, error);

        return $stream;
    }

    /**
     * Gets the top 10 top airing anime
     *
     * @returns Top Airing anime stream
     */
    public getTopUpcomingAnime(): Observable<AnimeResponse> {
        const url = `${this.api}/anime?filter[status]=upcoming&page[limit]=10&sort=-user_count`;
        const error = 'No top upcoming anime stream found';
        const $stream = this.checkAnimeStream('top_upcoming', url, error);

        return $stream;
    }

    /**
     * Gets the top 10 top airing anime
     *
     * @returns Top Airing anime stream
     */
    public getMostPopularAnime(): Observable<AnimeResponse> {
        const url = `${this.api}/anime?page[limit]=10&sort=-user_count`;
        const error = 'No most popular anime stream found';
        const $stream = this.checkAnimeStream('most_popular', url, error);

        return $stream;
    }

    /**
     * Gets the top 40 anime categories
     *
     * @returns Anime categories stream
     */
    public getAnimeCategories(): Observable<CategoryResponse> {
        const url = `${this.api}/categories?page[limit]=40&sort=-total_media_count`;
        const error = 'No anime with the provided name could be found.';
        const $stream = this.checkCategoryStream('anime_categories', url, error);

        return $stream;
    }

    /**
     * Gets anime info for the requested name
     *
     * @param anime_name The slug prop of an anime response. IE: one pice -> one-piece
     *
     * @returns Anime stream
     */
    public getAnime(anime_name: string) {
        const url = `${this.api}/anime/${anime_name}`;
        const error = 'No anime with the provided name could be found.';
        const $stream = this.checkAnimeStream(anime_name, url, error);

        return $stream;
    }

    /**
     * Checks the anime stream for an existing request and creates one if nothing is found
     *
     * @param key They key to lookup in the map
     * @param url The URL of the request that needs to be made
     * @param error_msg An error message to display if getting the stream fails
     *
     * @returns Stream of the requested API call
     */
    private checkAnimeStream(key: string, url: string, error_msg: string): Observable<AnimeResponse> {
        if (!this.anime_stream_map.has(key)) {
            this.storeAnimeStream(key, url);
        }

        const $stream = this.anime_stream_map.get(key);

        if (!$stream) {
            return throwError(() => new Error(error_msg));
        }

        return $stream;
    }

    /**
     * Checks the category stream for an existing request and creates one if nothing is found
     *
     * @param key They key to lookup in the map
     * @param url The URL of the request that needs to be made
     * @param error_msg An error message to display if getting the stream fails
     *
     * @returns Stream of the requested API call
     */
    private checkCategoryStream(key: string, url: string, error_msg: string): Observable<CategoryResponse> {
        if (!this.category_stream_map.has(key)) {
            this.storeCategoryStream(key, url);
        }

        const $stream = this.category_stream_map.get(key);

        if (!$stream) {
            return throwError(() => new Error(error_msg));
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

    private getCategoryStream(url: string) {
        return this.http
            .get<CategoryResponse>(url)
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
    private storeAnimeStream(key: string, url: string): void {
        const $anime_stream = this.getAnimeStream(url);
        this.anime_stream_map.set(key, $anime_stream);
    }

    /**
     * Stores a category stream
     *
     * @param key The key to store the stream under in the hash map
     * @param url The URL of the endpoint to query
     */
    private storeCategoryStream(key: string, url: string): void {
        const $category_stream = this.getCategoryStream(url);
        this.category_stream_map.set(key, $category_stream);
    }
}
