// profitability-display.component.ts
@Component({
    selector: 'app-profitability-display',
    template: `
        <mat-table [dataSource]="profitData">
            <ng-container matColumnDef="item">
                <mat-header-cell *matHeaderCellDef>Item</mat-header-cell>
                <mat-cell *matCellDef="let row">{{ row.item }}</mat-cell>
            </ng-container>
            <!-- Add more columns for cost, revenue, profit -->
        </mat-table>
    `,
})
export class ProfitabilityDisplayComponent {
    @Input() profitData: any[] = [];
}
