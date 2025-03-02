// src/app/services/profession.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Profession } from '../models/profession.interface';
import { Recipe } from '../models/recipe.interface';

@Injectable({
    providedIn: 'root',
})
export class ProfessionService {
    private professionsSubject = new BehaviorSubject<Profession[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private errorSubject = new BehaviorSubject<string | null>(null);

    professions$ = this.professionsSubject.asObservable();
    loading$ = this.loadingSubject.asObservable();
    error$ = this.errorSubject.asObservable();

    constructor(private http: HttpClient) {
        this.loadProfessions();
    }

    private loadProfessions() {
        this.loadingSubject.next(true);
        this.errorSubject.next(null);
        this.http
            .get<Profession[]>('assets/professions.json')
            .pipe(
                tap((professions) => {
                    this.professionsSubject.next(professions);
                    this.loadingSubject.next(false);
                }),
                catchError((error) => {
                    this.errorSubject.next('Failed to load professions data.');
                    this.loadingSubject.next(false);
                    return throwError(() => error);
                }),
            )
            .subscribe();
    }

    getProfessions(): Observable<Profession[]> {
        return this.professions$;
    }

    getProfession(professionId: string): Observable<Profession | undefined> {
        return this.getProfessions().pipe(
            map((professions) =>
                professions.find((p) => p.id === professionId),
            ),
        );
    }

    getRecipe(
        professionId: string,
        recipeId: string,
    ): Observable<Recipe | undefined> {
        return this.getProfession(professionId).pipe(
            map((profession) =>
                profession?.recipes.find((r) => r.id === recipeId),
            ),
        );
    }
}
