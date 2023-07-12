import { Injectable } from "@angular/core";
import { NavigationEnd, RouteConfigLoadStart, Router } from "@angular/router";

import { BehaviorSubject } from "rxjs";

import { LoadingState } from "@shared/models/loading-state.type";

@Injectable({
    providedIn: 'root'
})
export class PageLoaderService {
    private $showLoader: BehaviorSubject<LoadingState> = new BehaviorSubject<LoadingState>(false);
    private timer: number = 0;
    private timer_interval?: NodeJS.Timer;

    constructor(private router: Router) {
        this.router.events.subscribe({
            next: (event) => {
                /**
                 * RouteConfigLoadStart | RouteConfigLoadEnd
                 * These events are fired when your lazy loaded modules are being initialized
                 * Might need these in future but from testing
                 * NavigationStart and NavigationEnd seem to work fine
                 */

                if (event instanceof RouteConfigLoadStart) {
                    this.$showLoader.next(true);

                    // Creating a buffer to make sure the loader doesn't flash-bang the user
                    this.timer_interval = setInterval(() => {
                        this.timer += 50;
                    }, 50);
                }

                if (event instanceof NavigationEnd) {
                    if (this.timer_interval) {
                        // Make sure the time passed is more than 500ms
                        if (this.timer < 500) {
                            clearInterval(this.timer_interval);
                            this.timer_interval = undefined;

                            setTimeout(() => {
                                this.$showLoader.next(false);
                                this.timer = 0;
                            }, 500 - this.timer);
                        } else {
                            this.$showLoader.next(false)
                        }
                    } else {
                        this.$showLoader.next(false);
                    }
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
