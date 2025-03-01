// src/app/components/recipe-detail/recipe-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { ActivatedRoute } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';

interface Recipe {
    id: string;
    name: string;
    professionId: string;
    inputJson: string;
    materials: { itemId: string; quantity: number }[];
    outputItem: { itemId: string; quantity: number };
}

interface AuctionData {
    itemId: string;
    price: number;
}

@Component({
    selector: 'app-recipe-detail',
    standalone: true,
    imports: [
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        FormsModule,
        ClipboardModule,
        MatTableModule,
        MatSnackBarModule,
    ],
    template: `
        <div class="container">
            <mat-card>
                <mat-card-header>
                    <mat-card-title>{{
                        recipe?.name || 'Recipe'
                    }}</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                    <div class="form-group">
                        <mat-form-field appearance="fill">
                            <mat-label>Search JSON</mat-label>
                            <textarea
                                matInput
                                [(ngModel)]="recipe.inputJson"
                                readonly
                            ></textarea>
                        </mat-form-field>
                        <button
                            mat-button
                            [cdkCopyToClipboard]="recipe.inputJson"
                        >
                            Copy
                        </button>
                    </div>

                    <div class="form-group">
                        <mat-form-field appearance="fill">
                            <mat-label>Auction Data</mat-label>
                            <textarea
                                matInput
                                [(ngModel)]="auctionJson"
                                placeholder="Paste JSON here"
                            ></textarea>
                        </mat-form-field>
                        <button mat-button (click)="calculateProfit()">
                            Calculate
                        </button>
                    </div>

                    <div class="results" *ngIf="profitData.length">
                        <h3>Profitability</h3>
                        <mat-table [dataSource]="profitData">
                            <ng-container matColumnDef="item">
                                <mat-header-cell *matHeaderCellDef
                                    >Item</mat-header-cell
                                >
                                <mat-cell *matCellDef="let row">{{
                                    row.item
                                }}</mat-cell>
                            </ng-container>
                            <ng-container matColumnDef="cost">
                                <mat-header-cell *matHeaderCellDef
                                    >Cost</mat-header-cell
                                >
                                <mat-cell *matCellDef="let row">{{
                                    row.cost
                                }}</mat-cell>
                            </ng-container>
                            <mat-header-row
                                *matHeaderRowDef="['item', 'cost']"
                            ></mat-header-row>
                            <mat-row
                                *matRowDef="let row; columns: ['item', 'cost']"
                            ></mat-row>
                        </mat-table>
                    </div>
                </mat-card-content>
            </mat-card>
        </div>
    `,
    styles: [
        `
            .container {
                max-width: 800px;
                margin: 0 auto;
                padding: 24px;
            }
            mat-card {
                margin-bottom: 16px;
            }
            mat-card-header {
                border-bottom: 1px solid rgba(255, 255, 255, 0.12);
            }
            mat-card-title {
                font-size: 20px;
            }
            .form-group {
                margin-bottom: 24px;
            }
            mat-form-field {
                width: 100%;
                border-radius: 4px;
            }
            textarea {
                min-height: 100px;
            }
            .results {
                margin-top: 24px;
            }
            h3 {
                font-size: 18px;
                margin-bottom: 16px;
            }
        `,
    ],
})
export class RecipeDetailComponent implements OnInit {
    recipe: Recipe = {
        id: '',
        name: '',
        professionId: '',
        inputJson: '',
        materials: [],
        outputItem: { itemId: '', quantity: 0 },
    };
    auctionJson = '';
    profitData: { item: string; cost: number }[] = [];

    private recipes: Recipe[] = [
        {
            id: '1',
            name: 'Enchant Weapon - Power',
            professionId: 'enchanting',
            inputJson: '{"itemId": "123", "quantity": 1}',
            materials: [
                { itemId: '123', quantity: 1 },
                { itemId: '124', quantity: 2 },
            ],
            outputItem: { itemId: '125', quantity: 1 },
        },
        {
            id: '1',
            name: 'Frostweave Bag',
            professionId: 'tailoring',
            inputJson: '{"itemId": "456", "quantity": 2}',
            materials: [
                { itemId: '456', quantity: 4 },
                { itemId: '457', quantity: 1 },
            ],
            outputItem: { itemId: '458', quantity: 1 },
        },
    ];

    constructor(
        private route: ActivatedRoute,
        private snackBar: MatSnackBar,
    ) {}

    ngOnInit() {
        const professionId = this.route.snapshot.paramMap.get('id');
        const recipeId = this.route.snapshot.paramMap.get('recipeId');
        const foundRecipe = this.recipes.find(
            (r) => r.professionId === professionId && r.id === recipeId,
        );
        if (foundRecipe) {
            this.recipe = foundRecipe;
        }
    }

    calculateProfit() {
        if (!this.auctionJson) {
            this.snackBar.open(
                'Please paste auction data before calculating.',
                'Dismiss',
                { duration: 3000 },
            );
            return;
        }

        try {
            const auctionData: AuctionData[] = JSON.parse(this.auctionJson);
            let totalCost = 0;
            const materialCosts = this.recipe.materials.map((material) => {
                const priceData = auctionData.find(
                    (data) => data.itemId === material.itemId,
                );
                const cost = (priceData?.price || 0) * material.quantity;
                totalCost += cost;
                return { item: `Material ${material.itemId}`, cost };
            });

            const revenueData = auctionData.find(
                (data) => data.itemId === this.recipe.outputItem.itemId,
            );
            const revenue =
                (revenueData?.price || 0) * this.recipe.outputItem.quantity;
            const profit = revenue - totalCost;

            this.profitData = [
                ...materialCosts,
                { item: 'Total Cost', cost: totalCost },
                { item: 'Revenue', cost: revenue },
                { item: 'Profit', cost: profit },
            ];
        } catch (error) {
            console.error('Error parsing auction data:', error);
            this.snackBar.open('Invalid auction data format.', 'Dismiss', {
                duration: 3000,
            });
        }
    }
}
