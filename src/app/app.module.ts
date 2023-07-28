// ANgular specific modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Firebase tings
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';

// Google Analytics
import { NgxGoogleAnalyticsModule, NgxGoogleAnalyticsRouterModule  } from 'ngx-google-analytics';

// Toaster

import { ToastrModule } from 'ngx-toastr';

// Routes
import { AppRoutingModule } from './app-routing.module';

// Custom Modules
import { SharedModule } from './shared/shared.module';

// Pages
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

// Components
import { AppComponent } from './app.component';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { IntroComponent } from './components/intro/intro.component';

// Environment
import { environment } from 'src/environments/environment';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { AnimeCardComponent } from './components/anime-card/anime-card.component';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        CategoryListComponent,
        IntroComponent,
        NotFoundComponent,
        SearchPageComponent,
        AnimeCardComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        SharedModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        AngularFirestoreModule,
        AngularFireStorageModule,
        NgxGoogleAnalyticsModule.forRoot(environment.ga_id),
        NgxGoogleAnalyticsRouterModule,
        ToastrModule.forRoot({
            positionClass: 'toast-bottom-right',
            progressBar: true,
            extendedTimeOut: 5000,
        }),
        BrowserAnimationsModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule { }
