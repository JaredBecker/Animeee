import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from './components/card/card.component';
import { SliderComponent } from './components/slider/slider.component';
import { NavbarComponent } from './components/navbar/navbar.component';

@NgModule({
    declarations: [
        CardComponent,
        SliderComponent,
        NavbarComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
    ],
    exports: [
        NgbModule,
        CardComponent,
        SliderComponent,
        NavbarComponent,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }
