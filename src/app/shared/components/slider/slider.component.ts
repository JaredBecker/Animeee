import {
    Component,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges
} from '@angular/core';

import { Observable, Subscription } from 'rxjs';

import { AnimeResponse } from '../../models/anime-response.interface';
import { Router } from '@angular/router';

@Component({
    selector: 'app-slider',
    templateUrl: './slider.component.html',
    styleUrls: ['./slider.component.scss'],
})
export class SliderComponent implements OnChanges, OnInit, OnDestroy {
    @Input() public $anime_stream?: Observable<AnimeResponse>;
    @Input() public title?: string;

    public animes?: any[];
    public is_loading: boolean = true;

    private anime_subscription?: Subscription;

    constructor(
        private router: Router,
    ) {}

    public ngOnChanges(changes: SimpleChanges): void {
        this.anime_subscription?.unsubscribe();
        this.subToStream();
    }

    public ngOnInit(): void {
        this.subToStream();
    }

    private subToStream(): void {
        this.anime_subscription = this.$anime_stream?.subscribe({
            next: (data) => {
                this.animes = data.data;
                this.is_loading = false;
            },
            error: (err) => {
                console.error(err);
            }
        })
    }

    public ngOnDestroy(): void {
        this.anime_subscription?.unsubscribe();
    }

    public onLoadAnime(anime: any): void {
        this.router.navigateByUrl(`/anime/${anime.attributes.slug}`, {
            state: { anime }
        })
    }
}
