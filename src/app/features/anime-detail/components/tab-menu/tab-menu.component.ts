import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbNav } from '@ng-bootstrap/ng-bootstrap';
import { AnimeDetailService } from '@shared/services/anime-detail.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-tab-menu',
    templateUrl: './tab-menu.component.html',
    styleUrls: ['./tab-menu.component.scss']
})
export class TabMenuComponent implements OnInit, OnDestroy {
    @Input() public type!: string;
    @ViewChild('nav') public nav!: NgbNav;

    public active: number = 0;
    public episode_tab_title: string = 'Episodes';

    private view_event_subscription?: Subscription;

    constructor(private animeDetailService: AnimeDetailService) { }

    public ngOnInit(): void {
        this.episode_tab_title = this.type === 'anime' ? 'Episodes' : 'Chapters';
        this.view_event_subscription = this.animeDetailService.getViewCharacterEvent()
            .subscribe({
                next: () => this.nav.select(2)
            })
    }

    public ngOnDestroy(): void {
        this.view_event_subscription?.unsubscribe();
    }
}
