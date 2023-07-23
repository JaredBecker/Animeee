import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { Observable } from 'rxjs';

import { AnimeService } from 'src/app/shared/services/anime.service';
import { Response } from '@shared/models/response.interface';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    private $trending_anime?: Observable<Response>;
    private $top_airing_anime?: Observable<Response>;
    private $highest_rating_anime?: Observable<Response>;
    private $most_popular_anime?: Observable<Response>;
    private $top_upcoming_anime?: Observable<Response>;

    public get trending() {
        return this.$trending_anime;
    }

    public get topAiring() {
        return this.$top_airing_anime;
    }

    public get highestRating() {
        return this.$highest_rating_anime;
    }

    public get mostPopular() {
        return this.$most_popular_anime;
    }

    public get topUpcoming() {
        return this.$top_upcoming_anime;
    }

    constructor(
        private animeService: AnimeService,
        private titleService: Title,
    ) { }

    public ngOnInit(): void {
        this.titleService.setTitle('Animeee | Home');
        this.$trending_anime = this.animeService.getTrendingAnime();
        this.$top_airing_anime = this.animeService.getTopAiringAnime();
        this.$highest_rating_anime = this.animeService.getHighestRatedAnime();
        this.$most_popular_anime = this.animeService.getMostPopularAnime();
        this.$top_upcoming_anime = this.animeService.getTopUpcomingAnime();
    }
}
