import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

import { AppRoutingModule } from './app-routing.module';

import { SharedModule } from './shared/shared.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { IntroComponent } from './components/intro/intro.component';
import { AnimeDetailsComponent } from './pages/anime-details/anime-details.component';
import { TabMenuComponent } from './components/tab-menu/tab-menu.component';
import { SummaryComponent } from './components/summary/summary.component';
import { EpisodesComponent } from './components/episodes/episodes.component';
import { CharactersComponent } from './components/characters/characters.component';
import { FranchiseComponent } from './components/franchise/franchise.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { environment } from 'src/environments/environment';
import { LoginComponent } from './pages/login/login.component';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        CategoryListComponent,
        IntroComponent,
        AnimeDetailsComponent,
        TabMenuComponent,
        SummaryComponent,
        EpisodesComponent,
        CharactersComponent,
        FranchiseComponent,
        NotFoundComponent,
        LoginComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        SharedModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule { }
