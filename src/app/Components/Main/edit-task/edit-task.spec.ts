import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTask } from './edit-task';
import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { Todos } from '../../../services/taskServices/todoService';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('EditTask', () => {
  let component: EditTask;
  let fixture: ComponentFixture<EditTask>;
  let taskService:Todos;
  let router:Router;
  const fakeActivatedRoute = {
  snapshot: {
    params: { id: 1 } // test ID
  }
};
  const mockError = new HttpErrorResponse({
    error:"Unable to get Task with Id",
    status:403,
    statusText:"Forbidden",
    redirected:false
  });
  const mockTask = [
      { id: 1, title: "Finish project report", description: "Complete and submit the final report to the manager.", dueDate: new Date("2025-10-08"), dueTime: "17:00", completed: false, userId: 1 },
      { id: 2, title: "Team meeting", description: "Weekly sync-up with the product and development teams.", dueDate: new Date("2025-10-07"), dueTime: "10:30", completed: false, userId: 1 }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTask, HttpClientTestingModule],
      providers: [{provide: ActivatedRoute, useValue: fakeActivatedRoute}]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditTask);
    component = fixture.componentInstance;
    taskService = TestBed.inject(Todos);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

// TestCase:1 [ngOnInit() method]
  it('should call the getTaskById using paramId method when ever', ()=>{
    const mockId = 1;
    component.id.set(1);

    spyOn(component, 'getTaskById');
    spyOn(taskService, 'getTodoById').and.returnValue(of(mockTask[0]));
    component.ngOnInit();

    expect(component.getTaskById).toHaveBeenCalledWith(mockId);
    expect(component.id()).toBe(mockId);
    component.task.set(mockTask[0]);
    expect(component.task()).toBe(mockTask[0]);
  });

// TestCase:2 [getTaskById should set task with value if success]
  it('should set task with value if getTaskById success', ()=>{
    const mockId = 2;

    spyOn(taskService, 'getTodoById').and.returnValue(of(mockTask[1]));
    component.getTaskById(mockId);

    expect(taskService.getTodoById).toHaveBeenCalledOnceWith(mockId);
    expect(component.task()).toEqual(mockTask[1]);
  });

// TestCase:2(a) [getTaskById should set errorMessage, alert and reroute to home if getTaskById failed]
  it('should set errorMessage, alert and reroute to home if getTaskById failed', ()=>{
    const mockId = 2;

    spyOn(window, 'alert');
    spyOn(router,'navigate');
    spyOn(taskService, 'getTodoById').and.returnValue(throwError(()=>mockError));
    component.getTaskById(mockId);

    expect(taskService.getTodoById).toHaveBeenCalledOnceWith(mockId);
    expect(component.errorMessage()).toEqual(mockError);
    expect(window.alert).toHaveBeenCalledOnceWith("Unable to Fetch task for editing: "+JSON.stringify(mockError));
    expect(router.navigate).toHaveBeenCalledOnceWith(['/']);
  });

// TestCase:3 [update task method success]
  it('should update the task and reroute to home if success', ()=>{
    jasmine.clock().install();
    const mockUpdateTask = { id: 1, title: "Finish project report", description: "Complete and submit the final report to the manager.", dueDate: new Date("2025-10-08"), dueTime: "17:00", completed: false, userId: 1 };
    const mockId = 1;
    spyOn(taskService, 'updateTodo').and.returnValue(of(mockUpdateTask));
    spyOn(router, 'navigate');
    spyOn(window, 'alert');

    component.updateTask(mockUpdateTask);

    expect(taskService.updateTodo).toHaveBeenCalledOnceWith(mockId, mockUpdateTask);
    expect(window.alert).toHaveBeenCalledOnceWith("Task updated Successfully!");

    jasmine.clock().tick(1000);

    expect(router.navigate).toHaveBeenCalledOnceWith(['/']);

    jasmine.clock().uninstall();
  });

// TestCase:3 [update task method fails]
  it('should not update task and should alert', () =>{
    const alertSpy = spyOn(window,'alert');
    const mockTask = { id: 1, title: "Finish project report", description: "Complete and submit the final report to the manager.", dueDate: new Date("2025-10-08"), dueTime: "17:00", completed: false, userId: 1 };
    const mockId = 1;
    const taskServiceSpy = spyOn(taskService, 'updateTodo').and.returnValue(throwError(()=>mockError));

    component.updateTask(mockTask);
    const mockUpdatedTask = {...mockTask, id: mockId, completed: false, userId: mockTask.userId};

    expect(taskServiceSpy).toHaveBeenCalledOnceWith(mockId, mockUpdatedTask)
    expect(alertSpy).toHaveBeenCalledOnceWith("Unable to update Task: "+JSON.stringify(mockError));
    expect(component.errorMessage()).toEqual(mockError);
  })
});
