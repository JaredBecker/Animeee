import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@shared/shared.module';

import { ProfileRoutingModule } from './profile.routing.module';

import { ProfileComponent } from './pages/profile/profile.component';
import { CompletedComponent } from './components/completed/completed.component';

@NgModule({
    declarations: [
        ProfileComponent,
        CompletedComponent
    ],
    imports: [
        CommonModule,
        ProfileRoutingModule,
        SharedModule
    ]
})
export class ProfileModule { }
