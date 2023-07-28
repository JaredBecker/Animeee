import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '@shared/guards/auth.guard';

import { ProfileComponent } from './pages/profile/profile.component';
import { CompletedComponent } from './components/completed/completed.component';

const routes: Routes = [
    {
        path: '',
        component: ProfileComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        children: [
            {
                path: 'completed',
                component: CompletedComponent
            }
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProfileRoutingModule { }
