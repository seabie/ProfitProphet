// recipe-detail.component.ts
@Component({
    selector: 'app-recipe-detail',
    template: `
        <mat-card>
            <mat-card-header>{{ recipe.name }}</mat-card-header>
            <mat-card-content>
                <h3>Search JSON</h3>
                <textarea
                    matInput
                    [(ngModel)]="recipe.inputJson"
                    readonly
                ></textarea>
                <button mat-button [cdkCopyToClipboard]="recipe.inputJson">
                    Copy
                </button>

                <h3>Paste Auction Data</h3>
                <textarea
                    matInput
                    [(ngModel)]="auctionJson"
                    placeholder="Paste JSON from WoW add-on"
                ></textarea>
                <button mat-button (click)="calculateProfit()">
                    Calculate
                </button>
            </mat-card-content>
        </mat-card>
    `,
})
export class RecipeDetailComponent {
    @Input() recipe!: Recipe;
    auctionJson: string = '';

    constructor(private profitabilityService: ProfitabilityService) {}

    calculateProfit() {
        const auctionData: AuctionData[] = JSON.parse(this.auctionJson);
        this.profitabilityService.calculateProfit(this.recipe, auctionData);
    }
}
