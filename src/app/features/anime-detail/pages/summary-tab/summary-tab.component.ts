import { Component, EventEmitter, Output } from '@angular/core';

import { AnimeDetailService } from '@shared/services/anime-detail.service';

@Component({
  selector: 'app-summary-tab',
  templateUrl: './summary-tab.component.html',
  styleUrls: ['./summary-tab.component.scss']
})
export class SummaryTabComponent {
    public anime!: any;
    public loading_anime: boolean = true;

    constructor(private animeDetailService: AnimeDetailService) { }

    public ngOnInit(): void {
        this.anime = this.animeDetailService.getCurrentAnime();
        this.loading_anime = false;
    }
}
