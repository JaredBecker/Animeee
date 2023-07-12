import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription, of, switchMap } from 'rxjs';
import { AnimeDetail } from 'src/app/shared/models/anime-detail.interface';

import { AnimeResponse } from 'src/app/shared/models/anime-response.interface';
import { AnimeDetailService } from 'src/app/shared/services/anime-detail.service';

@Component({
    selector: 'app-anime-details',
    templateUrl: './anime-details.component.html',
    styleUrls: ['./anime-details.component.scss']
})
export class AnimeDetailsComponent implements OnInit, OnDestroy {
    public anime?: any;
    public is_loading: boolean = true;
    public anime_details: AnimeDetail[] = [];

    public url?: SafeHtml;

    private route_subscription?: Subscription;

    constructor(
        private sanitizer: DomSanitizer,
        private animeDetailService: AnimeDetailService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
    ) { }

    public ngOnInit(): void {
        this.route_subscription = this.activatedRoute.paramMap
            .pipe(
                switchMap((params) => {
                    const anime_name = params.get('anime-name');

                    if (!anime_name) {
                        this.router.navigateByUrl('/not-found', { skipLocationChange: true });
                        return of({} as AnimeResponse);
                    }

                    return this.animeDetailService.getAnimeSummary(anime_name);
                })
            )
            .subscribe({
                next: (anime) => {
                    if (anime.data.length > 0) {
                        sessionStorage.setItem('selected-anime', JSON.stringify(anime));
                        this.anime = anime.data[0];
                        this.buildDetailsList();
                        this.is_loading = false;

                        this.url = this.sanitizer.bypassSecurityTrustResourceUrl('http://www.youtube.com/embed/' + this.anime.attributes.youtubeVideoId);

                        console.log(this.anime);
                    }
                },
                error: (err) => {
                    console.error(err);
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
