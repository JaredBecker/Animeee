import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

import { AuthGuard } from '@shared/guards/auth.guard';

const routes: Routes = [
    { path: '', component: HomeComponent },
    {
        path: 'auth',
        loadChildren: () => import('@features/auth/auth.module').then(m => m.AuthModule)
    },
    {
        path: 'profile',
        canActivateChild: [AuthGuard],
        loadChildren: () => import('@features/profile/profile.module').then(m => m.ProfileModule)
    },
    {
        path: 'anime/:anime-name',
        loadChildren: () => import('@features/anime-detail/anime-detail.module').then(m => m.AnimeDetailModule)
    },
    { path: 'not-found', component: NotFoundComponent },
    { path: '**', component: NotFoundComponent },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
