import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription, of, switchMap } from 'rxjs';

import { AnimeDetail } from 'src/app/shared/models/anime-detail.interface';
import { AnimeDetailService } from 'src/app/shared/services/anime-detail.service';
import { Response } from '@shared/models/response.interface';
import { AnimeService } from '@shared/services/anime.service';

@Component({
    selector: 'app-anime-details',
    templateUrl: './anime-details.component.html',
    styleUrls: ['./anime-details.component.scss']
})
export class AnimeDetailsComponent implements OnInit, OnDestroy {
    public anime?: any;
    public is_loading: boolean = true;
    public anime_details: AnimeDetail[] = [];
    public characters?: any[];

    public url?: SafeHtml;

    private route_subscription?: Subscription;

    constructor(
        private sanitizer: DomSanitizer,
        private animeDetailService: AnimeDetailService,
        private animeService: AnimeService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
    ) { }

    public ngOnInit(): void {
        this.route_subscription = this.activatedRoute.paramMap
            .pipe(
                switchMap((params) => {
                    const anime_name = params.get('anime-name');

                    if (!anime_name) {
                        this.router.navigateByUrl('/');
                        return of({} as Response);
                    }

                    // Need to chain these switchMaps because the anime ID is needed to get the characters
                    return this.animeService.getAnime(anime_name).pipe(
                        switchMap((anime_details) => {
                            if (anime_details.data.length > 0) {
                                this.anime = anime_details.data[0];
                                this.animeDetailService.setCurrentAnime(this.anime);

                                /**
                                 * Need to set reaction type here so the stream can get
                                 * setup so when it's actually used its available. I
                                 * Don't like this fix but I can't seem to get it to
                                 * work any other way so it's staying like this for now
                                 */
                                this.animeDetailService.setReactionType('popular');

                                if (this.anime.attributes.youtubeVideoId) {
                                    this.url = this.sanitizer.bypassSecurityTrustResourceUrl('http://www.youtube.com/embed/' + this.anime.attributes.youtubeVideoId);
                                }

                                this.buildDetailsList();

                                const categories = anime_details.included?.filter(info => info.type === 'categories');

                                if (categories) {
                                    this.animeDetailService.setCategories(categories);
                                }
                            }

                            return this.animeService.getCharacterInfo(this.anime.id)
                        })
                    );
                })
            )
            .subscribe({
                next: (character_info) => {
                    this.animeDetailService.setCharacterInfo(character_info.included);
                    this.is_loading = false;
                },
                error: (err) => {
                    console.error('Failed to get selected anime', err);
                    this.is_loading = false;
                }
            });
    }

    public ngOnDestroy(): void {
        this.route_subscription?.unsubscribe();
    }

    public getCoverImage(): string {
        if (this.anime.attributes.coverImage) {
            return this.anime.attributes.coverImage.original;
        }

        return '/assets/images/default-cover.png';
    }

    public buildDetailsList(): void {
        const details: AnimeDetail[] = [];
        const anime = this.anime.attributes;

        details.push({title: 'English', value: anime.titles.en});
        details.push({title: 'Japanese', value: anime.titles.ja_jp});
        details.push({title: 'Japanese (Romaji)', value: anime.titles.en_jp});
        details.push({title: 'Type', value: anime.showType});
        details.push({title: 'Episodes', value: anime.episodeCount});
        details.push({title: 'Status', value: anime.status});
        details.push({title: 'Aired', value: `${anime.startDate} to ${anime.endDate}`});
        details.push({title: 'Rating', value: anime.ageRatingGuide});

        this.anime_details = details;
    }

    public onClick(): void {
        alert('This will work one day... I promise');
    }
}
