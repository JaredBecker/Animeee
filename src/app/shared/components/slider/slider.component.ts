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

    public ngOnChanges(changes: SimpleChanges): void {
        this.anime_subscription?.unsubscribe();

        this.anime_subscription = this.$anime_stream?.subscribe((data) => {
            this.animes = data.data;
            this.is_loading = false;
        })
    }

    public ngOnInit(): void {
        this.anime_subscription = this.$anime_stream?.subscribe((data) => {
            this.animes = data.data;
            this.is_loading = false;
        })
    }

    public ngOnDestroy(): void {
        this.anime_subscription?.unsubscribe();
    }
}
