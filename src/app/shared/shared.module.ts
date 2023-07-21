import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from './components/card/card.component';
import { SliderComponent } from './components/slider/slider.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoaderComponent } from './components/loader/loader.component';
import { PageLoaderComponent } from './components/page-loader/page-loader.component';
import { CharacterModalComponent } from './components/character-modal/character-modal.component';
import { TopShadowDirective } from './directives/top-shadow.directive';
import { EpisodeModalComponent } from './components/episode-modal/episode-modal.component';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
    declarations: [
        CardComponent,
        SliderComponent,
        NavbarComponent,
        LoaderComponent,
        PageLoaderComponent,
        CharacterModalComponent,
        TopShadowDirective,
        EpisodeModalComponent,
        FooterComponent,
    ],
    imports: [
        CommonModule,
        NgbModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    exports: [
        NgbModule,
        CardComponent,
        SliderComponent,
        NavbarComponent,
        LoaderComponent,
        PageLoaderComponent,
        FormsModule,
        ReactiveFormsModule,
        CharacterModalComponent,
        FooterComponent,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }
