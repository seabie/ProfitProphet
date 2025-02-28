// profession-list.component.ts
@Component({
    selector: 'app-profession-list',
    template: `
      <mat-nav-list>
        <a mat-list-item 
           *ngFor="let profession of professions"
           [routerLink]="['/profession', profession.id]">
          {{profession.name}}
        </a>
      </mat-nav-list>
    `
  })
  export class ProfessionListComponent {
    professions: Profession[] = [
      { id: 'enchanting', name: 'Enchanting', recipes: [...] },
      { id: 'tailoring', name: 'Tailoring', recipes: [...] }
      // Add other professions
    ];
  }