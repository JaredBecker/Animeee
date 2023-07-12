import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@shared/shared.module';
import { AnimeDetailRoutingModule } from './anime-detail.routing.module';

import { AnimeDetailsComponent } from './pages/anime-details/anime-details.component';
import { CharactersComponent } from './components/characters/characters.component';
import { EpisodesComponent } from './components/episodes/episodes.component';
import { FranchiseComponent } from './components/franchise/franchise.component';
import { SummaryComponent } from './components/summary/summary.component';
import { TabMenuComponent } from './components/tab-menu/tab-menu.component';

@NgModule({
    declarations: [
        AnimeDetailsComponent,
        CharactersComponent,
        EpisodesComponent,
        FranchiseComponent,
        SummaryComponent,
        TabMenuComponent,
    ],
    imports: [
        CommonModule,
        AnimeDetailRoutingModule,
        SharedModule
    ]
})
export class AnimeDetailModule { }
