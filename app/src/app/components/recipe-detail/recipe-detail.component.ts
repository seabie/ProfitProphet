// src/app/components/recipe-detail/recipe-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
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
import { ProfitabilityService } from '@services/profitability.service';
import { Recipe } from '@models/recipe.interface';
import { ProfitResult } from '@models/profit-result.interface';

@Component({
    selector: 'app-recipe-detail',
    standalone: true,
    imports: [
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        NgIf,
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
                        recipe.name || 'Recipe'
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
                            <mat-label>Auction Data (JSON)</mat-label>
                            <textarea
                                matInput
                                [(ngModel)]="auctionJson"
                                placeholder='Example: [{"itemId": "123", "price": 100}, {"itemId": "124", "price": 50}]'
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
                                    >Cost/Value</mat-header-cell
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

    constructor(
        private route: ActivatedRoute,
        private snackBar: MatSnackBar,
        private profitabilityService: ProfitabilityService,
    ) {}

    ngOnInit() {
        const professionId = this.route.snapshot.paramMap.get('id');
        const recipeId = this.route.snapshot.paramMap.get('recipeId');

        // In a real app, fetch recipes from a service; for now, use a static list
        const professions = [
            {
                id: 'enchanting',
                name: 'Enchanting',
                recipes: [
                    {
                        id: '1',
                        name: 'Enchant Weapon - Power',
                        professionId: 'enchanting',
                        inputJson: '{"itemId": "123", "quantity": 1}',
                        materials: [
                            { itemId: '123', quantity: 1, name: 'Arcane Dust' },
                            {
                                itemId: '124',
                                quantity: 2,
                                name: 'Greater Planar Essence',
                            },
                        ],
                        outputItem: {
                            itemId: '125',
                            quantity: 1,
                            name: 'Enchant Weapon - Power',
                        },
                    },
                    {
                        id: '2',
                        name: 'Enchant Bracer - Stamina',
                        professionId: 'enchanting',
                        inputJson: '{"itemId": "126", "quantity": 1}',
                        materials: [
                            { itemId: '123', quantity: 3, name: 'Arcane Dust' },
                        ],
                        outputItem: {
                            itemId: '126',
                            quantity: 1,
                            name: 'Enchant Bracer - Stamina',
                        },
                    },
                ],
            },
            {
                id: 'tailoring',
                name: 'Tailoring',
                recipes: [
                    {
                        id: '1',
                        name: 'Frostweave Bag',
                        professionId: 'tailoring',
                        inputJson: '{"itemId": "456", "quantity": 2}',
                        materials: [
                            {
                                itemId: '456',
                                quantity: 4,
                                name: 'Frostweave Cloth',
                            },
                            {
                                itemId: '457',
                                quantity: 1,
                                name: 'Eternium Thread',
                            },
                        ],
                        outputItem: {
                            itemId: '458',
                            quantity: 1,
                            name: 'Frostweave Bag',
                        },
                    },
                    {
                        id: '2',
                        name: 'Netherweave Bag',
                        professionId: 'tailoring',
                        inputJson: '{"itemId": "459", "quantity": 2}',
                        materials: [
                            {
                                itemId: '460',
                                quantity: 4,
                                name: 'Netherweave Cloth',
                            },
                            {
                                itemId: '457',
                                quantity: 1,
                                name: 'Eternium Thread',
                            },
                        ],
                        outputItem: {
                            itemId: '459',
                            quantity: 1,
                            name: 'Netherweave Bag',
                        },
                    },
                ],
            },
        ];

        const profession = professions.find((p) => p.id === professionId);
        if (profession) {
            const foundRecipe = profession.recipes.find(
                (r) => r.id === recipeId,
            );
            if (foundRecipe) {
                this.recipe = foundRecipe;
            } else {
                this.snackBar.open('Recipe not found.', 'Dismiss', {
                    duration: 3000,
                });
            }
        } else {
            this.snackBar.open('Profession not found.', 'Dismiss', {
                duration: 3000,
            });
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
            const auctionData = JSON.parse(this.auctionJson);
            const result: ProfitResult =
                this.profitabilityService.calculateProfit(
                    this.recipe,
                    auctionData,
                );

            this.profitData = [
                ...result.materialCosts,
                { item: 'Total Cost', cost: result.totalCost },
                result.revenue,
                { item: 'Profit', cost: result.profit },
            ];

            this.snackBar.open(
                result.profit >= 0
                    ? `Profit calculated: ${result.profit}`
                    : `Loss calculated: ${result.profit}`,
                'Dismiss',
                { duration: 3000 },
            );
        } catch (error: any) {
            console.error('Error calculating profit:', error);
            this.snackBar.open(
                error.message || 'Invalid auction data format.',
                'Dismiss',
                { duration: 3000 },
            );
        }
    }
}
