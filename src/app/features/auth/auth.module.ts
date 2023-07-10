import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginComponent } from './pages/login/login.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuthRoutingModule } from './auth.routing.module';
import { SignUpComponent } from './components/sign-up/sign-up.component';

@NgModule({
    declarations: [
        LoginComponent,
        SignInComponent,
        SignUpComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        AuthRoutingModule
    ]
})
export class AuthModule { }
