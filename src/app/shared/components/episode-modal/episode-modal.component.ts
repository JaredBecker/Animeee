import { Component, Input, OnInit, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
    selector: 'app-episode-modal',
    templateUrl: './episode-modal.component.html',
    styleUrls: ['./episode-modal.component.scss']
})
export class EpisodeModalComponent implements OnInit {
    @Input() public episode!: any;

    public description?: SafeHtml;
    public loading_image: boolean = true;

    private sanitizer: DomSanitizer = inject(DomSanitizer);

    public ngOnInit(): void {
        if (this.episode.attributes.description)
        this.description = this.sanitizer.bypassSecurityTrustHtml(this.episode.attributes.description);
    }

    // TODO: Fix this loading. Its causing a weird jump when the image loads
    public onLoad(): void {
        this.loading_image = false;
    }
}
