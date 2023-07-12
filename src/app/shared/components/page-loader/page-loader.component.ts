import { PageLoaderService } from '@shared/services/page-loader.service';
import { Component, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-page-loader',
  templateUrl: './page-loader.component.html',
  styleUrls: ['./page-loader.component.scss']
})
export class PageLoaderComponent implements OnDestroy {
    public title?: string;
    public show: boolean = true;

    private is_loading_subscription?: Subscription;

    constructor(private pageLoaderService: PageLoaderService) {
        this.is_loading_subscription = this.pageLoaderService
        .getLoadingState()
        .subscribe({
            next: state => {
                if (typeof state === 'boolean') {
                    this.title = undefined;
                    this.show = state;
                } else {
                    this.title = state.title;
                    this.show = state.state;
                }
            },
            error: err => console.error('Error with page loader stream', err),
        })
    }

    public ngOnDestroy(): void {
        this.is_loading_subscription?.unsubscribe();
    }
}
