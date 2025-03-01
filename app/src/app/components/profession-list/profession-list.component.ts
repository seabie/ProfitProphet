// src/app/components/profession-list/profession-list.component.ts
import { Component } from '@angular/core';
import { NgForOf } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-profession-list',
    standalone: true,
    imports: [MatListModule, NgForOf, RouterLink],
    template: `
        <mat-nav-list>
            <a
                mat-list-item
                *ngFor="let profession of professions"
                [routerLink]="['/profession', profession.id, 'recipe', '1']"
            >
                {{ profession.name }}
            </a>
        </mat-nav-list>
    `,
    styles: [],
})
export class ProfessionListComponent {
    professions = [
        { id: 'enchanting', name: 'Enchanting' },
        { id: 'tailoring', name: 'Tailoring' },
    ];
}
