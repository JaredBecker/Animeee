import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, Subscription, of, switchMap } from 'rxjs';

import { AnimeDetail } from 'src/app/shared/models/anime-detail.interface';
import { AnimeDetailService } from 'src/app/shared/services/anime-detail.service';
import { Response } from '@shared/models/response.interface';
import { AnimeService } from '@shared/services/anime.service';
import { environment } from 'src/environments/environment';
import { UserService } from '@shared/services/user.service';
import { AuthService } from '@shared/services/auth.service';

@Component({
    selector: 'app-anime-details',
    templateUrl: './anime-details.component.html',
    styleUrls: ['./anime-details.component.scss']
})
export class AnimeDetailsComponent implements OnInit, OnDestroy {
    public anime?: any;
    public anime_details: AnimeDetail[] = [];
    public characters?: any[];
    public type: string = 'anime';
    public url?: SafeHtml;

    public is_logged_in: boolean = false;
    public is_loading: boolean = true;
    public completed_loading: boolean = false;
    public want_to_watch_loading: boolean = false;
    public started_watching_loading: boolean = false;
    public on_hold_loading: boolean = false;
    public must_watch_loading: boolean = false;


    private route_subscription?: Subscription;
    private auth_subscription?: Subscription;

    constructor(
        private sanitizer: DomSanitizer,
        private animeDetailService: AnimeDetailService,
        private animeService: AnimeService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private titleService: Title,
        private userService: UserService,
        private authService: AuthService,
    ) { }

    public ngOnInit(): void {
        this.auth_subscription = this.authService.getAuthStream().subscribe({
            next: (auth_state) => this.is_logged_in = auth_state,
        });

        this.route_subscription = this.activatedRoute.paramMap
            .pipe(
                switchMap((params) => {
                    const anime_name = params.get('anime-name');
                    const manga_name = params.get('manga-name');

                    // Need to chain these switchMaps because the anime ID is needed to get the characters
                    if (anime_name) {
                        this.type = 'anime';
                        return this.handleAnimeLoad(anime_name);
                    } else if (manga_name) {
                        this.type = 'manga';
                        return this.handleMangaLoad(manga_name);
                    }

                    this.router.navigateByUrl('/');
                    return of({} as Response);
                })
            )
            .subscribe({
                next: (character_info) => {
                    this.animeDetailService.setCharacterInfo(character_info.included);
                    this.titleService.setTitle(`Animeee | ${this.anime.attributes.titles.en ? this.anime.attributes.titles.en : this.anime.attributes.titles.en_jp}`);
                    this.is_loading = false;
                },
                error: (err) => {
                    /**
                     * From testing I notice you end up her when the API had no result for an anime
                     * it gives to you in the franchise section.
                     */
                    this.router.navigateByUrl('/not-found');
                    console.error('Failed to get selected anime', err);
                    this.is_loading = false;
                }
            });
    }

    public ngOnDestroy(): void {
        this.route_subscription?.unsubscribe();
        this.auth_subscription?.unsubscribe();
    }

    public getCoverImage(): string {
        if (this.anime.attributes.coverImage) {
            return this.anime.attributes.coverImage.original;
        }

        return '/assets/images/default-cover.png';
    }

    public buildDetailsList(type: 'anime' | 'manga'): void {
        const details: AnimeDetail[] = [];
        const anime = this.anime.attributes;

        if (anime.titles.en) details.push({ title: 'English', value: anime.titles.en });
        if (anime.titles.ja_jp) details.push({ title: 'Japanese', value: anime.titles.ja_jp });
        if (anime.titles.en_jp) details.push({ title: 'Romaji', value: anime.titles.en_jp });
        if (anime.showType) details.push({ title: 'Type', value: anime.showType });
        if (anime.episodeCount) details.push({ title: 'Episodes', value: anime.episodeCount });
        if (anime.chapterCount) details.push({ title: 'Chapters', value: anime.chapterCount });
        if (anime.status) details.push({ title: 'Status', value: anime.status });
        if (anime.startDate && anime.endDate) {
            details.push({ title: type === 'anime' ? 'Aired' : 'Published', value: `${anime.startDate} to ${anime.endDate}` })
        } else if (anime.startDate) {
            details.push({ title: type === 'anime' ? 'Aired' : 'Published', value: `${anime.startDate}` })
        }
        if (anime.ageRatingGuide) details.push({ title: 'Rating', value: anime.ageRatingGuide });
        if (anime.nsfw && anime.nsfw !== null) details.push({ title: 'NSFW', value: anime.nsfw });

        this.anime_details = details;
    }

    public onClick(): void {
        alert('This will work one day... I promise');
    }

    private handleAnimeLoad(anime_name: string): Observable<Response> {
        return this.animeService.getAnime(anime_name).pipe(
            switchMap((anime_details) => {
                if (anime_details.data.length > 0) {
                    this.anime = anime_details.data[0];
                    this.anime.type = 'anime';
                    this.animeDetailService.setCurrentAnime(this.anime);
                    /**
                     * Need to set reaction type here so the stream can get
                     * setup so when it's actually used its available. I
                     * Don't like this fix but I can't seem to get it to
                     * work any other way so it's staying like this for now
                     */
                    this.animeDetailService.setReactionType('Anime', 'popular');

                    if (this.anime.attributes.youtubeVideoId) {
                        const http = environment.production ? 'https://' : 'http://';
                        this.url = this.sanitizer.bypassSecurityTrustResourceUrl(`${http}www.youtube.com/embed/${this.anime.attributes.youtubeVideoId}`);
                    }

                    this.buildDetailsList('anime');

                    const categories = anime_details.included?.filter(info => info.type === 'categories');

                    if (categories) {
                        this.animeDetailService.setCategories(categories);
                    }
                }

                return this.animeService.getCharacterInfo(this.anime.id, 'Anime')
            })
        );
    }

    public onAddToComplete() {
        this.completed_loading = true;
        this.userService.addToComplete(this.anime)
            .then(() => this.completed_loading = false)
            .catch(() => this.completed_loading = false);
    }

    public onAddToWantToWatch() {
        this.want_to_watch_loading = true;
        this.userService.addToWantToWatch(this.anime)
            .then(() => this.want_to_watch_loading = false)
            .catch(() => this.want_to_watch_loading = false);
    }

    public onStartedWatching() {
        this.started_watching_loading = true;
        this.userService.addToWatching(this.anime)
            .then(() => this.started_watching_loading = false)
            .catch(() => this.started_watching_loading = false);
    }

    public onHold() {
        this.on_hold_loading = true;
        this.userService.addToOnHold(this.anime)
            .then(() => this.on_hold_loading = false)
            .catch(() => this.on_hold_loading = false);
    }

    public onMustWatch() {
        this.must_watch_loading = true;
        this.userService.addToMustWatch(this.anime)
            .then(() => this.must_watch_loading = false)
            .catch(() => this.must_watch_loading = false);
    }

    private handleMangaLoad(manga_name: string) {
        return this.animeService.getManga(manga_name).pipe(
            switchMap((manga_details) => {
                if (manga_details.data.length > 0) {
                    this.anime = manga_details.data[0];
                    this.anime.type = 'manga';
                    this.animeDetailService.setCurrentAnime(this.anime);
                    this.animeDetailService.setReactionType('Manga', 'popular');

                    this.buildDetailsList('manga');

                    if (manga_details.included) {
                        this.animeDetailService.setCategories(manga_details.included);
                    }
                }

                return this.animeService.getCharacterInfo(this.anime.id, 'Manga')
            })
        )
    }
}
