// src/app/models/recipe.interface.ts
export interface Recipe {
    id: string;
    name: string;
    professionId: string;
    inputJson: string;
    materials: { itemId: string; quantity: number; name?: string }[];
    outputItem: { itemId: string; quantity: number; name?: string };
}
