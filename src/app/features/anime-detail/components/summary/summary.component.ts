import { Component, OnInit } from '@angular/core';
import { AnimeDetailService } from '@shared/services/anime-detail.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {
    public anime!: any;
    public characters?: any;
    public loading_anime: boolean = true;
    public loading_characters: boolean = true;

    constructor(private animeDetailService: AnimeDetailService) { }

    public ngOnInit(): void {
        this.anime = this.animeDetailService.getCurrentAnime();
        this.loading_anime = false;
        this.characters = this.animeDetailService.getCharacters();
        this.loading_characters = false;
        console.log(this.characters);
        console.log('summary');
    }
}
