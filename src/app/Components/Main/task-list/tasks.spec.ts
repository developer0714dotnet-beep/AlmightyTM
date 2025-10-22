import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tasks } from './tasks';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { Task } from '../../../interfaces/Task';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TasksList', () => {
  let component: Tasks;
  let fixture: ComponentFixture<Tasks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tasks, HttpClientTestingModule],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Tasks);
    component = fixture.componentInstance;
  });

  it('should create tasklist component', () => {
    expect(component).toBeTruthy();
  });

  // spyOn is the method used to capture the actions of a method from a component
  it('checked method should emit id', () =>{
      spyOn(component.OnChecked, "emit");

      // act
      component.checked(2);

      // assertion or expectation
      expect(component.OnChecked.emit).toHaveBeenCalled();
  });

    it('deleteTodo method should emit id', () =>{
      spyOn(component.OnDeleteTodo, "emit");

      // act
      component.deleteTodo(2);

      // assertion or expectation
      expect(component.OnDeleteTodo.emit).toHaveBeenCalled();
  });

  it("title should have value", () =>{
    fixture.componentRef.setInput("title", "Extra tasks");
    fixture.detectChanges();
    expect(component.title()).toBe("Extra tasks");
  });

  it("trackById should return Id", ()=>{
    const todo:Task = {id: 12, title: "Hello", description: null, dueDate: new Date(),
                      dueTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second:'2-digit' }),
                      completed: false,
                      userId: 1};

    const result1 = component.trackById(0, todo);
    const result2 = component.trackById(0, todo);

    expect(result1).toBe(12);
    expect(result2).toBe(12);
  })
});
