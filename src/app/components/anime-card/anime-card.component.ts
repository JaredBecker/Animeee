import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-anime-card',
    templateUrl: './anime-card.component.html',
    styleUrls: ['./anime-card.component.scss']
})
export class AnimeCardComponent {
    @Input() public anime!: any;

    constructor(private router: Router) { }

    public onLoadAnime(anime: any): void {
        this.router.navigateByUrl(`/anime/${anime.attributes.slug}`);
    }
}
