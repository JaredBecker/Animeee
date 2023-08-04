import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '@shared/guards/auth.guard';

import { ProfileComponent } from './pages/profile/profile.component';
import { CompletedComponent } from './components/completed/completed.component';
import { OnHoldComponent } from './components/on-hold/on-hold.component';
import { WantToWatchComponent } from './components/want-to-watch/want-to-watch.component';
import { CurrentlyWatchingComponent } from './components/currently-watching/currently-watching.component';

const routes: Routes = [
    {
        path: '',
        component: ProfileComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        children: [
            {
                path: 'completed',
                component: CompletedComponent
            },
            {
                path: 'on-hold',
                component: OnHoldComponent
            },
            {
                path: 'want-to-watch',
                component: WantToWatchComponent
            },
            {
                path: 'currently-watching',
                component: CurrentlyWatchingComponent
            },
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProfileRoutingModule { }
