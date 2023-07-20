import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AnimeSortType, AnimeSortTypeURL } from '@shared/models/anime-sort-type.interface';
import { Response } from '@shared/models/response.interface';

import { Observable, Subject, map, shareReplay, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AnimeService {
    // The more I work with this api the more I hate life... ಥ_ಥ
    private api: string = 'https://kitsu.io/api/edge';

    private anime_stream_map = new Map<string, Observable<Response>>();
    private category_stream_map = new Map<string, Observable<Response>>();
    private manga_stream_map = new Map<string, Observable<Response>>();
    private $search_stream: Subject<Observable<Response>> = new Subject();
    private $more_results_stream: Subject<Observable<Response>> = new Subject();

    constructor(private http: HttpClient) { }

    /**
     * Gets the top 10 trending anime
     *
     * @returns Trending anime stream
     */
    public getTrendingAnime(): Observable<Response> {
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
    public getHighestRatedAnime(): Observable<Response> {
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
    public getTopAiringAnime(): Observable<Response> {
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
    public getTopUpcomingAnime(): Observable<Response> {
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
    public getMostPopularAnime(): Observable<Response> {
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
    public getAnimeCategories(): Observable<Response> {
        const url = `${this.api}/categories?page[limit]=40&sort=-total_media_count`;
        const error = 'No anime with the provided name could be found.';
        const $stream = this.checkCategoryStream('anime_categories', url, error);

        return $stream;
    }

    /**
     * Used to get the categories of an anime
     *
     * @param url The URL provided in the anime response under "relationships -> categories -> links -> related"
     *
     * @returns Stream of categories for the provided URL
     */
    public getCategories(url: string): Observable<Response> {
        return this.http.get<Response>(url).pipe(
            map((categories) => categories)
        )
    }

    /**
     * Gets anime info for the requested name
     *
     * @param anime_name The slug for the anime
     *
     * @returns Anime stream
     */
    public getAnime(anime_name: string): Observable<Response> {
        const url = `${this.api}/anime?fields[categories]=slug,title&filter[slug]=${anime_name}&include=categories,animeProductions.producer`;
        const error = 'No anime with the provided name could be found.';
        const $stream = this.checkAnimeStream(anime_name, url, error);

        return $stream;
    }

    /**
     * Gets manga info for the requested name
     *
     * @param manga_name The slug for the manga
     *
     * @returns Manga stream
     */
    public getManga(manga_name: string): Observable<Response> {
        const url = `${this.api}/manga?fields[categories]=slug,title&filter[slug]=${manga_name}&include=categories`;
        const error = 'No anime with the provided name could be found.';
        const $stream = this.checkAnimeStream(manga_name, url, error);

        return $stream;
    }

    /**
     * Gets character info for the provided anime/manga ID
     *
     * @param id ID of the anime/manga
     * @param count Amount of results to return. -1 returns 20 (API limit)
     *
     * @returns Character info stream
     */
    public getCharacterInfo(id: number, type: 'Anime' | 'Manga', count: number = 4): Observable<Response> {
        const count_filter = `&page[limit]=${count === -1 || count > 20 ? 20 : count}`;
        const language = type === 'Anime' ? '&filter[language]=Japanese' : '';
        const url = `${this.api}/castings?filter[media_type]=${type}&filter[media_id]=${id}&filter[is_character]=true${language}${count_filter}&include=character&sort=-featured`;

        return this.http.get<Response>(url);
    }

    /**
     * Gets the reactions for a anime/manga
     *
     * @param id ID of the anime/manga to get reactions from
     * @param sort How to sort the results
     * @param count The number of reaction to return
     *
     * @returns Reactions stream
     */
    public getReactions(id: number, type: 'Anime' | 'Manga', sort: 'popular' | 'recent', count: number): Observable<Response> {
        const sort_option = sort === 'popular' ? '-upVotesCount' : '-createdAt';
        const id_type = type === 'Anime' ? 'animeId' : 'mangaId'
        return this.http.get<Response>(`${this.api}/media-reactions?filter[${id_type}]=${id}&include=user&page[limit]=${count}&sort=${sort_option}`);
    }

    /**
     * Gets the first 20 episodes for an anime
     *
     * @param anime_id The ID of the anime to get episodes for
     *
     * @returns Episode stream
     */
    public getEpisodes(anime_id: number): Observable<Response> {
        return this.http.get<Response>(`${this.api}/episodes?filter[mediaType]=Anime&filter[media_id]=${anime_id}&page[limit]=20&sort=number`);
    }

    /**
     * Get franchise info for an anime
     *
     * @param anime_id ID of the anime
     *
     * @returns Franchise stream
     */
    public getFranchise(anime_id: number): Observable<Response> {
        return this.http.get<Response>(`${this.api}/media-relationships?filter[source_id]=${anime_id}&filter[source_type]=Anime&include=destination&page[limit]=20&sort=role`)
    }

    /**
     * Use to do a general search on all available data
     *
     * @param search_phrase Search phrase
     * @param type Anime or mange
     *
     * @returns Search stream
     */
    public generalSearch(search_phrase: string, type: 'anime' | 'manga' = 'anime'): Observable<Response> {
        return this.http.get<Response>(`${this.api}/${type}?filter[text]=${search_phrase}&page[limit]=20`);
    }

    /**
     * Takes the search phrase and sets search stream
     *
     * @param search_phrase Search phrase
     * @param type Anime or mange
     */
    public setSearchPhrase(search_phrase: string, type: 'anime' | 'manga' = 'anime'): void {
        this.$search_stream.next(
            this.generalSearch(search_phrase, type)
        );
    }

    /**
     * Takes the category and sets the search stream
     *
     * @param category category name to search for
     */
    public setCategorySearch(category: string, type: 'anime' | 'manga' = 'anime'): void {
        // TODO: Make category sort type dynamic
        this.$search_stream.next(
            this.http.get<Response>(`${this.api}/${type}?filter[categories]=${category}&page[limit]=20&sort=popularityRank`)
        );
    }

    /**
     * Takes the type and sets the search stream (most-popular, top-airing...)
     *
     * @param key The type to search for
     */
    public setTypeSearch(key: AnimeSortType, type: 'anime' | 'manga' = 'anime'): void {
        const types: AnimeSortTypeURL = {
            'trending': `${this.api}/trending/${type}?limit=20`,
            'top-airing': `${this.api}/${type}?page[limit]=20&sort=-user_count`,
            'upcoming': `${this.api}/${type}?filter[status]=upcoming&page[limit]=20&sort=-user_count`,
            'highest-rated': `${this.api}/${type}?page[limit]=20&sort=-average_rating`,
            'most-popular': `${this.api}/${type}?page[limit]=20&sort=-user_count`,
        };

        this.$search_stream.next(
            this.http.get<Response>(types[key])
        );
    }

    /**
     * Sets the next set of results in the $more_results_stream
     *
     * @param next_link The URL to load the next set of data
     */
    public LoadMoreRequest(next_link: string): void {
        // TODO: Make this dynamic so anything with a next link can load more results
        this.$more_results_stream.next(
            this.http.get<Response>(next_link)
        )
    }

    /**
     * Get the search stream
     *
     * @returns Search stream
     */
    public getSearchStream(): Observable<Observable<Response>> {
        return this.$search_stream.asObservable();
    }

    public getMoreResultsStream(): Observable<Observable<Response>> {
        return this.$more_results_stream.asObservable();
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
    private checkAnimeStream(key: string, url: string, error_msg: string): Observable<Response> {
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
     * Checks the manga stream for an existing request and creates one if nothing is found
     *
     * @param key They key to lookup in the map
     * @param url The URL of the request that needs to be made
     * @param error_msg An error message to display if getting the stream fails
     *
     * @returns Stream of the requested API call
     */
    public checkMangaStream(key: string, url: string, error_msg: string) {
        if (!this.manga_stream_map.has(key)) {
            this.storeMangaStream(key, url);
        }

        const $stream = this.manga_stream_map.get(key);

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
    private checkCategoryStream(key: string, url: string, error_msg: string): Observable<Response> {
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
     * Builds an GET request with the provided URL
     *
     * @param url The URL the request needs to be made to
     *
     * @returns Observable of the info for the provided request
     */
    private getStream(url: string): Observable<Response> {
        return this.http
            .get<Response>(url)
            .pipe(
                shareReplay(1)
            );
    }

    /**
     * Builds a category request
     *
     * @param url The URL the request needs to be made to
     *
     * @returns Observable of the anime info for the provided request
     */
    private getCategoryStream(url: string): Observable<Response> {
        return this.http
            .get<Response>(url)
            .pipe(
                shareReplay(1)
            );
    }

    /**
     * Stores a anime stream
     *
     * @param key The key to store the stream under in the hash map
     * @param url The URL of the endpoint to query
     */
    private storeAnimeStream(key: string, url: string): void {
        const $anime_stream = this.getStream(url);
        this.anime_stream_map.set(key, $anime_stream);
    }

    /**
     * Stores a manga stream
     *
     * @param key The key to store the stream under in the hash map
     * @param url The URL of the endpoint to query
     */
    private storeMangaStream(key: string, url: string): void {
        const $manga_stream = this.getStream(url);
        this.manga_stream_map.set(key, $manga_stream);
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
