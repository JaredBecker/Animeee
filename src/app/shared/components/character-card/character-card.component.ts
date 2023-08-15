import { Component, Input } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CharacterModalComponent } from '@shared/components/character-modal/character-modal.component';
import { UserService } from '@shared/services/user.service';

@Component({
  selector: 'app-character-card',
  templateUrl: './character-card.component.html',
  styleUrls: ['./character-card.component.scss']
})
export class CharacterCardComponent {
    @Input() public character!: any;
    @Input() public show_remove_btn: boolean = false;

    constructor(
        private modalService: NgbModal,
        private userService: UserService,
    ) { }

    public onSelectCharacter(): void {
        const modalRef = this.modalService.open(CharacterModalComponent, { backdropClass: 'custom_backdrop' })
        modalRef.componentInstance.character = this.character;
    }

    public onRemoveCharacter() {
        this.userService.removeFavoriteCharacter(this.character.id);
    }
}
