import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Signup } from './signup';
import { provideRouter } from '@angular/router';

describe('Signup', () => {
  let component: Signup;
  let fixture: ComponentFixture<Signup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Signup],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Signup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("showPassword method should toggle", () =>{
    // initially false
    expect(component.showPassword()).toBeFalse();

    // toggle called
    component.togglePassword();

    // Should become true
    expect(component.showPassword()).toBeTrue();

    // reassuring toggle
    component.togglePassword();

    // Should become false
    expect(component.showPassword()).toBeFalse();
  });

  it('addUser method should get and log datas', ()=>{
    const field = {id:1, email: "saipr1231@gmail.com",password: "Enter@777",userName: "Saiprasanth", openDate: new Date()};
    const consoleSpy = spyOn(console,"log")

    component.addUser(field);

    expect(consoleSpy).toHaveBeenCalledWith(field);
  });
});
