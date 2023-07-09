import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, of, switchMap } from 'rxjs';
import { AnimeResponse } from 'src/app/shared/models/anime-response.interface';
import { AnimeDetailService } from 'src/app/shared/services/anime-detail.service';

@Component({
    selector: 'app-anime-details',
    templateUrl: './anime-details.component.html',
    styleUrls: ['./anime-details.component.scss']
})
export class AnimeDetailsComponent implements OnInit, OnDestroy {
    public is_loading: boolean = true;
    public anime?: any;

    private route_subscription?: Subscription;

    constructor(
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
                        this.is_loading = false;

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
}
