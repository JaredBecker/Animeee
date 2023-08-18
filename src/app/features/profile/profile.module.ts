import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@shared/shared.module';

import { ProfileRoutingModule } from './profile.routing.module';

import { ProfileComponent } from './pages/profile/profile.component';
import { CompletedComponent } from './components/completed/completed.component';
import { OnHoldComponent } from './components/on-hold/on-hold.component';
import { WantToWatchComponent } from './components/want-to-watch/want-to-watch.component';
import { CurrentlyWatchingComponent } from './components/currently-watching/currently-watching.component';
import { MustWatchComponent } from './components/must-watch/must-watch.component';
import { FavoriteCharactersComponent } from './components/favorite-characters/favorite-characters.component';
import { ProfileImageSelectDirective } from './directives/profile-image-select.directive';

@NgModule({
    declarations: [
        ProfileComponent,
        CompletedComponent,
        OnHoldComponent,
        WantToWatchComponent,
        CurrentlyWatchingComponent,
        MustWatchComponent,
        FavoriteCharactersComponent,
        EditProfileComponent,
        ProfileImageSelectDirective,
    ],
    imports: [
        CommonModule,
        ProfileRoutingModule,
        SharedModule
    ]
})
export class ProfileModule { }
