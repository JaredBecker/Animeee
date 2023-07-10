// ANgular specific modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

// Firebase tings | I honestly don't know if all this is needed. Come back to this later and just confirm
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';

// Routes
import { AppRoutingModule } from './app-routing.module';

// Custom Modules
import { SharedModule } from './shared/shared.module';

// Components
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
import { LoginComponent } from './pages/login/login.component';

// Environment
import { environment } from 'src/environments/environment';
import { RegisterComponent } from './pages/register/register.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './pages/verify-email/verify-email.component';

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
        RegisterComponent,
        ProfileComponent,
        ForgotPasswordComponent,
        VerifyEmailComponent,
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
        AngularFireDatabaseModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule { }
