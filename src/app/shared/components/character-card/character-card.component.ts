import { Component, Input } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CharacterModalComponent } from '@shared/components/character-modal/character-modal.component';

@Component({
  selector: 'app-character-card',
  templateUrl: './character-card.component.html',
  styleUrls: ['./character-card.component.scss']
})
export class CharacterCardComponent {
    @Input() public character!: any;

    constructor(
        private modalService: NgbModal,
    ) { }

    public onSelectCharacter(character: any): void {
        const modalRef = this.modalService.open(CharacterModalComponent, { backdropClass: 'custom_backdrop' })
        modalRef.componentInstance.character = character;
    }
}
