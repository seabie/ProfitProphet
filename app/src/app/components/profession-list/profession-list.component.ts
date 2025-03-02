// src/app/components/profession-list/profession-list.component.ts
import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Profession } from '@models/profession.interface';

@Component({
    selector: 'app-profession-list',
    standalone: true,
    imports: [MatListModule, RouterLink, CommonModule],
    template: `
        <div class="container">
            <h1>Professions</h1>
            <mat-list>
                <ng-container *ngFor="let profession of professions">
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
        `,
    ],
})
export class ProfessionListComponent {
    professions: Profession[] = [
        {
            id: 'enchanting',
            name: 'Enchanting',
            recipes: [
                {
                    id: '1',
                    name: 'Enchant Weapon - Power',
                    inputJson: '{"itemId": "123", "quantity": 1}',
                    professionId: 'enchanting', // remove me
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
                    inputJson: '{"itemId": "126", "quantity": 1}',
                    professionId: 'enchanting', // remove me
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
                    inputJson: '{"itemId": "456", "quantity": 2}',
                    professionId: 'tailoring', // remove me
                    materials: [
                        {
                            itemId: '456',
                            quantity: 4,
                            name: 'Frostweave Cloth',
                        },
                        { itemId: '457', quantity: 1, name: 'Eternium Thread' },
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
                    inputJson: '{"itemId": "459", "quantity": 2}',
                    professionId: 'tailoring', // remove me
                    materials: [
                        {
                            itemId: '460',
                            quantity: 4,
                            name: 'Netherweave Cloth',
                        },
                        { itemId: '457', quantity: 1, name: 'Eternium Thread' },
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
}
