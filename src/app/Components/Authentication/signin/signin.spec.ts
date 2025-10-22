import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Signin } from './signin';
import { provideRouter } from '@angular/router';

describe('Signin', () => {
  let component: Signin;
  let fixture: ComponentFixture<Signin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Signin],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Signin);
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
    const field = {id:1, email: "saipr1231@gmail.com",userName:"jamesCam:", password: "Enter@777"};
    const consoleSpy = spyOn(console,"log")

    component.confirmUser(field);

    expect(consoleSpy).toHaveBeenCalledWith(field);
  })
});
