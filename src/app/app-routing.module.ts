import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { AnimeDetailsComponent } from './pages/anime-details/anime-details.component';

const routes: Routes = [
    { path: '', component: HomeComponent },
    {
        path: 'anime',
        children: [
            {
                path: ':anime-name',
                component: AnimeDetailsComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
