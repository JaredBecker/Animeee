import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';

import { SharedModule } from './shared/shared.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { IntroComponent } from './components/intro/intro.component';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        CategoryListComponent,
        IntroComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        SharedModule
    ],
    providers: [],
    bootstrap: [AppComponent],
    // schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
