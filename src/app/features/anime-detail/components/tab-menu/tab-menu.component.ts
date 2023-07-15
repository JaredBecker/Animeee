import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbNav } from '@ng-bootstrap/ng-bootstrap';
import { AnimeDetailService } from '@shared/services/anime-detail.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-tab-menu',
    templateUrl: './tab-menu.component.html',
    styleUrls: ['./tab-menu.component.scss']
})
export class TabMenuComponent implements OnInit, OnDestroy {
    public active: number = 0;

    @ViewChild('nav') public nav!: NgbNav;
    private view_event_subscription?: Subscription;

    constructor(private animeDetailService: AnimeDetailService) { }

    public ngOnInit(): void {
        this.view_event_subscription = this.animeDetailService.getViewCharacterEvent()
            .subscribe({
                next: () => this.nav.select(2)
            })
    }

    public ngOnDestroy(): void {
        this.view_event_subscription?.unsubscribe();
    }
}
