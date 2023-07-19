import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
    selector: 'app-character-modal',
    templateUrl: './character-modal.component.html',
    styleUrls: ['./character-modal.component.scss']
})
export class CharacterModalComponent implements OnInit {
    @Input() public character!: any;
    public description?: SafeHtml;

    constructor(private sanitizer: DomSanitizer) { }

    public ngOnInit(): void {
        const desc = this.character.attributes.description;

        // This is here to handle HTML entities in the description like &gt;
        if (desc && desc !== '') {
            this.description = this.sanitizer.bypassSecurityTrustHtml(this.character.attributes.description);
        }
    }
}
