import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'professions', pathMatch: 'full' },
    { path: 'professions', component: ProfessionListComponent },
    {
        path: 'profession/:id/recipe/:recipeId',
        component: RecipeDetailComponent,
    },
];
