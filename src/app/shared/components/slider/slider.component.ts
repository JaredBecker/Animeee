import {
    Component,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { Router } from '@angular/router';

import { Observable, Subscription } from 'rxjs';

import { Response } from '@shared/models/response.interface';

@Component({
    selector: 'app-slider',
    templateUrl: './slider.component.html',
    styleUrls: ['./slider.component.scss'],
})
export class SliderComponent implements OnChanges, OnInit, OnDestroy {
    @Input() public $anime_stream?: Observable<Response>;
    @Input() public title?: string;
    @Input() public search_url!: string;

    public animes?: any[];
    public placeholders: any[] = new Array(10);
    public is_loading: boolean = true;

    private anime_subscription?: Subscription;

    constructor(private router: Router) { }

    public ngOnChanges(): void {
        this.anime_subscription?.unsubscribe();
        this.subToStream();
    }

    public ngOnInit(): void {
        this.subToStream();
    }

    public ngOnDestroy(): void {
        this.anime_subscription?.unsubscribe();
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

    public onLoadAnime(anime: any): void {
        this.router.navigateByUrl(`/anime/${anime.attributes.slug}`);
    }
}
