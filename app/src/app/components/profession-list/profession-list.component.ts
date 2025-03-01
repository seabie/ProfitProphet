// src/app/components/profession-list/profession-list.component.ts
import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-profession-list',
    standalone: true,
    imports: [MatListModule, RouterLink, CommonModule],
    template: `
        <div class="container">
            <h1>Professions</h1>
            <mat-list>
                <a
                    mat-list-item
                    *ngFor="let profession of professions"
                    [routerLink]="['/profession', profession.id, 'recipe', '1']"
                >
                    {{ profession.name }}
                </a>
            </mat-list>
        </div>
    `,
    styles: [
        `
            .container {
                max-width: 800px;
                margin: 0 auto;
                padding: 24px;
            }
            h1 {
                color: var(--text-primary);
                font-size: 24px;
                margin-bottom: 16px;
            }
            mat-list {
                background-color: #252526;
                border-radius: 4px;
                padding: 8px;
            }
            a.mat-list-item {
                color: var(--text-primary);
                margin-bottom: 8px;
                &:hover {
                    background-color: #2f2f2f;
                }
            }
        `,
    ],
})
export class ProfessionListComponent {
    professions = [
        { id: 'enchanting', name: 'Enchanting' },
        { id: 'tailoring', name: 'Tailoring' },
    ];
}
