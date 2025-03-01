import { Routes } from '@angular/router';
import { ProfessionListComponent } from './components/profession-list/profession-list.component';
import { RecipeDetailComponent } from './components/recipe-detail/recipe-detail.component';

export const routes: Routes = [
    { path: '', redirectTo: 'professions', pathMatch: 'full' },
    { path: 'professions', component: ProfessionListComponent },
    {
        path: 'profession/:id/recipe/:recipeId',
        component: RecipeDetailComponent,
    },
];
