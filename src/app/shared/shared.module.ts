import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from './components/card/card.component';
import { SliderComponent } from './components/slider/slider.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoaderComponent } from './components/loader/loader.component';
import { PageLoaderComponent } from './components/page-loader/page-loader.component';

@NgModule({
    declarations: [
        CardComponent,
        SliderComponent,
        NavbarComponent,
        LoaderComponent,
        PageLoaderComponent,
    ],
    imports: [
        CommonModule,
        NgbModule,
        RouterModule
    ],
    exports: [
        NgbModule,
        CardComponent,
        SliderComponent,
        NavbarComponent,
        LoaderComponent,
        PageLoaderComponent,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }
