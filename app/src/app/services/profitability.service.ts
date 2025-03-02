// src/app/services/profitability.service.ts
import { Injectable } from '@angular/core';
import { Recipe } from '@models/recipe.interface';
import { AuctionData } from '@models/auction-data.interface';
import { ProfitResult } from '@models/profit-result.interface';

@Injectable({
    providedIn: 'root', // Makes the service available globally
})
export class ProfitabilityService {
    calculateProfit(recipe: Recipe, auctionData: AuctionData[]): ProfitResult {
        // Validate auction data
        if (!Array.isArray(auctionData) || auctionData.length === 0) {
            throw new Error('Auction data must be a non-empty array.');
        }

        const invalidEntry = auctionData.find(
            (entry) =>
                !entry.itemId ||
                typeof entry.price !== 'number' ||
                entry.price < 0,
        );
        if (invalidEntry) {
            throw new Error(
                'Auction data contains invalid entries. Each entry must have an itemId and a non-negative price.',
            );
        }

        // Calculate material costs
        let totalCost = 0;
        const materialCosts = recipe.materials.map((material) => {
            const priceData = auctionData.find(
                (data) => data.itemId === material.itemId,
            );
            if (!priceData) {
                throw new Error(
                    `Price data not found for item ${material.name || material.itemId}.`,
                );
            }
            const cost = priceData.price * material.quantity;
            totalCost += cost;
            return {
                item: `${material.name || material.itemId} (x${material.quantity})`,
                cost,
            };
        });

        // Calculate revenue
        const revenueData = auctionData.find(
            (data) => data.itemId === recipe.outputItem.itemId,
        );
        if (!revenueData) {
            throw new Error(
                `Price data not found for output item ${recipe.outputItem.name || recipe.outputItem.itemId}.`,
            );
        }
        const revenue = revenueData.price * recipe.outputItem.quantity;
        const revenueEntry = {
            item: `${recipe.outputItem.name || recipe.outputItem.itemId} (x${recipe.outputItem.quantity})`,
            cost: revenue,
        };
        const profit = revenue - totalCost;

        return {
            materialCosts,
            totalCost,
            revenue: revenueEntry,
            profit,
        };
    }
}
