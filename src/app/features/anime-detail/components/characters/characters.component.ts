import { Component, OnInit } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AnimeDetailService } from '@shared/services/anime-detail.service';
import { CharacterModalComponent } from '@shared/components/character-modal/character-modal.component';

@Component({
    selector: 'app-characters',
    templateUrl: './characters.component.html',
    styleUrls: ['./characters.component.scss']
})
export class CharactersComponent implements OnInit {
    public characters: any[] = [];
    public loading_characters: boolean = true;

    constructor(
        private modalService: NgbModal,
        private animeDetailService: AnimeDetailService,
    ) { }

    public ngOnInit(): void {
        this.characters = this.animeDetailService.getCharacterInfo() ?? [];
        this.loading_characters = false;
    }

    public onViewCharacters() {
        this.animeDetailService.triggerViewCharacters();
    }

    public onSelectCharacter(character: any): void {
        const modalRef = this.modalService.open(CharacterModalComponent, { backdropClass: 'custom_backdrop' })
        modalRef.componentInstance.character = character;
    }
}
