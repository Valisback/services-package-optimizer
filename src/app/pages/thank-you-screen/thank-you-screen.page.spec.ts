import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ThankYouScreenPage } from './thank-you-screen.page';

describe('ThankYouScreenPage', () => {
  let component: ThankYouScreenPage;
  let fixture: ComponentFixture<ThankYouScreenPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThankYouScreenPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ThankYouScreenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
