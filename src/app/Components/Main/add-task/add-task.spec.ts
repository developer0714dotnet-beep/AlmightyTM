import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTask } from './add-task';
import { HttpErrorResponse} from '@angular/common/http';
import { Todos } from '../../../services/taskServices/todoService';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClientTestingModule, provideHttpClientTesting } from '@angular/common/http/testing';

describe('AddTask', () => {
  let component: AddTask;
  let fixture: ComponentFixture<AddTask>;
  let taskService: Todos;
  let router:Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTask, HttpClientTestingModule],
      providers: []
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTask);
    component = fixture.componentInstance;
    taskService = TestBed.inject(Todos);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

// TestCase:1 [ Success ] 
  it('should add task and alert successful if saveTodo is success', ()=>{
    const mockTask = { id: 1, title: "Finish project report", description: "Complete and submit the final report to the manager.", dueDate: new Date("2025-10-08"), dueTime: "17:00", completed: false, userId: 1 };
    jasmine.clock().install();

    const alertSpy = spyOn(window,'alert');
    spyOn(router, 'navigate');
    spyOn(taskService, 'saveTodo').and.returnValue(of(mockTask));
    component.addTask(mockTask);

    expect(taskService.saveTodo).toHaveBeenCalledWith(mockTask);
    expect(alertSpy).toHaveBeenCalledOnceWith("Task added Successfully");

    jasmine.clock().tick(1000);
    expect(router.navigate).toHaveBeenCalledOnceWith(['/']);
    jasmine.clock().uninstall();
  });

// TestCase:1 [ Failure ] 
  it('should  alert failed if saveTodo fails to add task', ()=>{
    const mockTask = { id: 1, title: "Finish project report", description: "Complete and submit the final report to the manager.", dueDate: new Date("2025-10-08"), dueTime: "17:00", completed: false, userId: 1 };
    const mockError = new HttpErrorResponse({
          error:"Unable to add Task",
          status:403,
          statusText:"Forbidden",
          redirected:false
    });

    const alertSpy = spyOn(window,'alert');
    spyOn(taskService, 'saveTodo').and.returnValue(throwError(()=>mockError));
    component.addTask(mockTask);

    expect(alertSpy).toHaveBeenCalledOnceWith("Unable to add Task: "+JSON.stringify(mockError));
  });
});
