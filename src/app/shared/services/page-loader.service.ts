import { Injectable } from "@angular/core";
import { NavigationEnd, NavigationStart, Router } from "@angular/router";

import { BehaviorSubject } from "rxjs";

import { LoadingState } from "@shared/models/loading-state.type";

@Injectable({
    providedIn: 'root'
})
export class PageLoaderService {
    private $showLoader: BehaviorSubject<LoadingState> = new BehaviorSubject<LoadingState>(false);

    constructor(private router: Router) {
        this.router.events.subscribe({
            next: (event) => {
                /**
                 * RouteConfigLoadStart | RouteConfigLoadEnd
                 * These events are fired when your lazy loaded modules are being initialized
                 * Might need these in future but from testing
                 * NavigationStart and NavigationEnd seem to work fine
                 */

                if (event instanceof NavigationEnd) {
                    this.$showLoader.next(false);
                }
            }
        })
    }

    /**
     * Get the stream of the loading state
     *
     * @returns Loading state stream
     */
    public getLoadingState() {
        return this.$showLoader.asObservable();
    }

    /**
     * Allows you to manually set the loading state
     *
     * @param state The loading state you want to set
     */
    public setLoadingState(state: LoadingState) {
        this.$showLoader.next(state);
    }
}
