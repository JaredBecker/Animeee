import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { SharedModule } from './shared/shared.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { IntroComponent } from './components/intro/intro.component';
import { AnimeDetailsComponent } from './pages/anime-details/anime-details.component';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        CategoryListComponent,
        IntroComponent,
        AnimeDetailsComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        SharedModule
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule { }
