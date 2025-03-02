// src/app/components/profession-list/profession-list.component.ts
import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProfessionService } from '../../services/profession.service';
import { Observable } from 'rxjs';
import { Profession } from '../../models/profession.interface';

@Component({
    selector: 'app-profession-list',
    standalone: true,
    imports: [MatListModule, RouterLink, CommonModule],
    template: `
        <div class="container">
            <h1>Professions</h1>
            <div *ngIf="loading$ | async" class="loading">Loading...</div>
            <div *ngIf="error$ | async as error" class="error">{{ error }}</div>
            <mat-list *ngIf="!(loading$ | async) && !(error$ | async)">
                <ng-container *ngFor="let profession of professions$ | async">
                    <h3 mat-subheader>{{ profession.name }}</h3>
                    <a
                        mat-list-item
                        *ngFor="let recipe of profession.recipes"
                        [routerLink]="[
                            '/profession',
                            profession.id,
                            'recipe',
                            recipe.id,
                        ]"
                    >
                        {{ recipe.name }}
                    </a>
                </ng-container>
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
                font-size: 24px;
                margin-bottom: 16px;
            }
            mat-list {
                border-radius: 4px;
                padding: 8px;
            }
            a.mat-list-item {
                margin-bottom: 8px;
            }
            h3.mat-subheader {
                margin-top: 16px;
                font-size: 18px;
            }
            .loading,
            .error {
                margin: 16px 0;
                font-style: italic;
                color: #999;
            }
        `,
    ],
})
export class ProfessionListComponent {
    professions$: Observable<Profession[]>;
    loading$: Observable<boolean>;
    error$: Observable<string | null>;

    constructor(private professionService: ProfessionService) {
        this.professions$ = this.professionService.getProfessions();
        this.loading$ = this.professionService.loading$;
        this.error$ = this.professionService.error$;
    }
}
