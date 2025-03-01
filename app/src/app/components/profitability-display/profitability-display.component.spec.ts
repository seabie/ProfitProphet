import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfitabilityDisplayComponent } from './profitability-display.component';

describe('ProfitabilityDisplayComponent', () => {
  let component: ProfitabilityDisplayComponent;
  let fixture: ComponentFixture<ProfitabilityDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfitabilityDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfitabilityDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
