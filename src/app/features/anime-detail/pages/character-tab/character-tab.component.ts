import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AnimeService } from '@shared/services/anime.service';
import { AnimeDetailService } from '@shared/services/anime-detail.service';
import { CharacterModalComponent } from '@shared/components/character-modal/character-modal.component';

@Component({
    selector: 'app-character-tab',
    templateUrl: './character-tab.component.html',
    styleUrls: ['./character-tab.component.scss']
})
export class CharacterTabComponent implements OnInit, OnDestroy {
    public is_loading: boolean = true;
    public characters: any[] = [];

    private character_subscription?: Subscription;

    constructor(
        private animeService: AnimeService,
        private animeDetailService: AnimeDetailService,
        private modalService: NgbModal,
    ) { }

    public ngOnInit(): void {
        const anime = this.animeDetailService.getCurrentAnime();

        if (anime) {
            this.character_subscription = this.animeService.getCharacterInfo(anime.id, -1)
                .subscribe({
                    next: (characters_res) => {
                        if (characters_res.included) {
                            this.characters = characters_res.included;
                        }

                        this.is_loading = false;
                    },
                    error: (err) => {
                        console.error('Error fetching characters', err);
                        this.is_loading = false;
                    }
                })
        }
    }

    public ngOnDestroy(): void {
        this.character_subscription?.unsubscribe();
    }

    public onSelectCharacter(character: any): void {
        const modalRef = this.modalService.open(CharacterModalComponent, { backdropClass: 'custom_backdrop' })
        modalRef.componentInstance.character = character;
    }
}
