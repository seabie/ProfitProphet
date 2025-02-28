// profitability.service.ts
@Injectable({
    providedIn: 'root',
})
export class ProfitabilityService {
    calculateProfit(recipe: Recipe, auctionData: AuctionData[]): any[] {
        let totalCost = 0;
        const materialCosts = recipe.materials.map((material) => {
            const priceData = auctionData.find(
                (data) => data.itemId === material.itemId,
            );
            const cost = (priceData?.price || 0) * material.quantity;
            totalCost += cost;
            return { item: material.itemId, cost };
        });

        const revenueData = auctionData.find(
            (data) => data.itemId === recipe.outputItem.itemId,
        );
        const revenue = (revenueData?.price || 0) * recipe.outputItem.quantity;
        const profit = revenue - totalCost;

        return [
            ...materialCosts,
            { item: 'Total Cost', cost: totalCost },
            { item: 'Revenue', cost: revenue },
            { item: 'Profit', cost: profit },
        ];
    }
}
