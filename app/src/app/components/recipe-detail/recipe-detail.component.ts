import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { Clipboard, ClipboardModule } from '@angular/cdk/clipboard';
@Component({
    selector: 'app-recipe-detail',
    standalone: true,
    imports: [
        ClipboardModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSnackBarModule,
        FormsModule,
    ],
    template: `
        <mat-card>
            <mat-card-header>Sample Recipe</mat-card-header>
            <mat-card-content>
                <mat-form-field>
                    <mat-label>Search JSON</mat-label>
                    <textarea
                        matInput
                        [(ngModel)]="sampleJson"
                        readonly
                    ></textarea>
                </mat-form-field>
                <button mat-button [cdkCopyToClipboard]="sampleJson">
                    Copy
                </button>

                <mat-form-field>
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
            </mat-card-content>
        </mat-card>
    `,
    styles: [],
})
export class RecipeDetailComponent {
    constructor(
        private snack: MatSnackBar,
        private clipboard: Clipboard,
    ) {}
    sampleJson = '{"itemId": "123", "quantity": 1}';
    auctionJson = '';

    copyJson() {
        this.clipboard.copy(this.sampleJson);
        this.snack.open('Copied to clipboard', 'Dismiss', {
            duration: 2000,
        });
    }

    calculateProfit() {
        console.log('Auction Data:', this.auctionJson);
    }
}
