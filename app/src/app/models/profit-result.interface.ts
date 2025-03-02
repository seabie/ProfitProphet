// src/app/models/profit-result.interface.ts
export interface ProfitResult {
    materialCosts: { item: string; cost: number }[];
    totalCost: number;
    revenue: { item: string; cost: number };
    profit: number;
}
