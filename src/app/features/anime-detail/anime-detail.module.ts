import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@shared/shared.module';
import { AnimeDetailRoutingModule } from './anime-detail.routing.module';

// Pages
import { AnimeDetailsComponent } from './pages/anime-details/anime-details.component';
import { CharacterTabComponent } from './pages/character-tab/character-tab.component';
import { EpisodeTabComponent } from './pages/episode-tab/episode-tab.component';
import { SummaryTabComponent } from './pages/summary-tab/summary-tab.component';

// Components
import { CharactersComponent } from './components/characters/characters.component';
import { EpisodesComponent } from './components/episodes/episodes.component';
import { FranchiseComponent } from './components/franchise/franchise.component';
import { SummaryComponent } from './components/summary/summary.component';
import { TabMenuComponent } from './components/tab-menu/tab-menu.component';
import { RelatedCategoriesComponent } from './components/related-categories/related-categories.component';
import { FranchiseTabComponent } from './pages/franchise-tab/franchise-tab.component';
import { ReactionsComponent } from './components/reactions/reactions.component';

@NgModule({
    declarations: [
        AnimeDetailsComponent,
        CharactersComponent,
        EpisodesComponent,
        FranchiseComponent,
        SummaryComponent,
        TabMenuComponent,
        RelatedCategoriesComponent,
        CharacterTabComponent,
        EpisodeTabComponent,
        FranchiseTabComponent,
        SummaryTabComponent,
        ReactionsComponent
    ],
    imports: [
        CommonModule,
        AnimeDetailRoutingModule,
        SharedModule
    ]
})
export class AnimeDetailModule { }
