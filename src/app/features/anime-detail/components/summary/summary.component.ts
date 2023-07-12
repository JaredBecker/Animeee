import { Component, OnInit } from '@angular/core';
import { AnimeDetailService } from '@shared/services/anime-detail.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {
    public anime!: any;

    constructor(private animeDetailService: AnimeDetailService) { }

    public ngOnInit(): void {
        this.anime = this.animeDetailService.getCurrentAnime();
    }
}
