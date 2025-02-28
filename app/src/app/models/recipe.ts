// recipe.ts
export interface Recipe {
    id: string;
    name: string;
    inputJson: string; // JSON string for WoW add-on
    materials: { itemId: string; quantity: number }[];
    outputItem: { itemId: string; quantity: number };
}
