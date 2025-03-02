// src/app/components/recipe-detail/recipe-detail.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { ProfessionService } from '@services/profession.service';
import { ProfitResult } from '@models/profit-result.interface';
import { Recipe } from '@models/recipe.interface';
import { Subscription } from 'rxjs';

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
            <mat-card *ngIf="recipe; else notFound">
                <mat-card-header>
                    <mat-card-title>{{ recipe.name }}</mat-card-title>
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
            <ng-template #notFound>
                <div class="error">Recipe not found.</div>
            </ng-template>
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
            .error {
                margin: 16px 0;
                font-style: italic;
                color: #999;
            }
        `,
    ],
})
export class RecipeDetailComponent implements OnInit, OnDestroy {
    recipe: Recipe;
    auctionJson = '';
    profitData: { item: string; cost: number }[] = [];
    private subscription: Subscription = new Subscription();

    constructor(
        private route: ActivatedRoute,
        private snackBar: MatSnackBar,
        private profitabilityService: ProfitabilityService,
        private professionService: ProfessionService,
    ) {
        this.recipe = {} as Recipe;
    }

    ngOnInit() {
        const professionId = this.route.snapshot.paramMap.get('id');
        const recipeId = this.route.snapshot.paramMap.get('recipeId');

        if (professionId && recipeId) {
            this.subscription.add(
                this.professionService
                    .getRecipe(professionId, recipeId)
                    .subscribe((recipe) => {
                        if (recipe) {
                            this.recipe = recipe;
                        } else {
                            this.snackBar.open('Recipe not found.', 'Dismiss', {
                                duration: 3000,
                            });
                        }
                    }),
            );
        } else {
            this.snackBar.open('Invalid profession or recipe ID.', 'Dismiss', {
                duration: 3000,
            });
        }
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
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

        if (!this.recipe) {
            this.snackBar.open('No recipe selected.', 'Dismiss', {
                duration: 3000,
            });
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
