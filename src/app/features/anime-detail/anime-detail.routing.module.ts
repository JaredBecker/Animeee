import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AnimeDetailsComponent } from './pages/anime-details/anime-details.component';

const routes: Routes = [
    {
        path: '',
        component: AnimeDetailsComponent,
        children: [

        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AnimeDetailRoutingModule { }
