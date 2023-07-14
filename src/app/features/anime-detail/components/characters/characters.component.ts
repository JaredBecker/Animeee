import { Component, OnInit } from '@angular/core';
import { AnimeDetailService } from '@shared/services/anime-detail.service';

@Component({
    selector: 'app-characters',
    templateUrl: './characters.component.html',
    styleUrls: ['./characters.component.scss']
})
export class CharactersComponent implements OnInit {
    public characters?: any;
    public loading_characters: boolean = true;

    constructor(private animeDetailService: AnimeDetailService) { }

    public ngOnInit(): void {
        this.characters = this.animeDetailService.getCharacters();
        this.loading_characters = false;
    }
}
