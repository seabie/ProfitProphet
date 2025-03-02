import { Recipe } from './recipe.interface';

// src/app/models/profession.interface.ts
export interface Profession {
    id: string;
    name: string;
    recipes: Recipe[];
}
