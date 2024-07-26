import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleSheetComponentComponent } from './google-sheet-component.component';

describe('GoogleSheetComponentComponent', () => {
  let component: GoogleSheetComponentComponent;
  let fixture: ComponentFixture<GoogleSheetComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoogleSheetComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GoogleSheetComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
