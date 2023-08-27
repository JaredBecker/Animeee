import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '@shared/guards/auth.guard';

import { ProfileComponent } from './pages/profile/profile.component';
import { CompletedComponent } from './components/completed/completed.component';
import { OnHoldComponent } from './components/on-hold/on-hold.component';
import { WantToWatchComponent } from './components/want-to-watch/want-to-watch.component';
import { CurrentlyWatchingComponent } from './components/currently-watching/currently-watching.component';
import { MustWatchComponent } from './components/must-watch/must-watch.component';
import { FavoriteCharactersComponent } from './components/favorite-characters/favorite-characters.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';

const routes: Routes = [
    {
        path: '',
        component: ProfileComponent,
        canActivateChild: [AuthGuard],
        children: [
            {
                path: 'completed',
                component: CompletedComponent,
            },
            {
                path: 'on-hold',
                component: OnHoldComponent,
            },
            {
                path: 'want-to-watch',
                component: WantToWatchComponent,
            },
            {
                path: 'currently-watching',
                component: CurrentlyWatchingComponent,
            },
            {
                path: 'must-watch',
                component: MustWatchComponent,
            },
            {
                path: 'favorite-characters',
                component: FavoriteCharactersComponent,
            },
            {
                path: 'edit',
                component: EditProfileComponent,
            },
        ]
    },
    {
        path: 'view/:username',
        component: ProfileComponent,
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
            {
                path: 'must-watch',
                component: MustWatchComponent
            },
            {
                path: 'favorite-characters',
                component: FavoriteCharactersComponent
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProfileRoutingModule { }
