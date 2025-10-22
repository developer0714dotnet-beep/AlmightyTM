import { TestBed } from '@angular/core/testing';

import { Todos } from './todoService';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, of, throwError } from 'rxjs';
import { Task } from '../../interfaces/Task';

describe('TodoServices', () => {
  let service: Todos;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  const mockError = new HttpErrorResponse({
    error: 'Something Went Wrong!. Try Again',
    status: 403,
    statusText: 'Unauthorized',
    redirected: false,
  });

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient',['get','post', 'put', 'delete']);
    TestBed.configureTestingModule({
      providers: [Todos,
        { provide: HttpClient, useValue: httpClientSpy }
      ]
    });
    
    service = TestBed.inject(Todos);
  });

  afterEach(()=>{
    expect(service.isLoading()).toBeFalse();
  })

  it('should be created todos', () => {
    expect(service).toBeTruthy();
  });

// TestCase:1(a) http get for getting all tasks/todos [success scenerio]
  it('should return all tasks on success when getTodo is called 1(a)', (done: DoneFn) =>{
    const mockTask = [
      { id: 1, title: "Finish project report", description: "Complete and submit the final report to the manager.", dueDate: new Date("2025-10-08"), dueTime: "17:00", completed: false, userId: 1 },
      { id: 2, title: "Team meeting", description: "Weekly sync-up with the product and development teams.", dueDate: new Date("2025-10-07"), dueTime: "10:30", completed: false, userId: 1 }
    ];

    httpClientSpy.get.and.returnValue(of(mockTask));

    service.getTodo().subscribe({
      next: (task:Task[]) => {
        expect(service.isLoading()).toBeTrue();   // after subscribe triggers execution
        expect(task).toEqual(mockTask);
      },
      complete: () => {
        expect(service.error()).toEqual(null);
        done();
      },
      error: done.fail
    });
  });

// TestCase:1(b) http get for getting all tasks/todos [failure scenerio]
  it('should throw error and set error signal 1(b)', (done: DoneFn)=>{
    httpClientSpy.get.and.returnValue(throwError(()=>mockError));
    

    service.getTodo().subscribe({
      next: (task:Task[]) => {
        expect(service.isLoading()).toBeTrue();
        done.fail('Expecting error, not task');
        expect(task).toBeNull();
      },
      error: (mockError) => { 
        catchError(mockError); 
        expect(service.error()).toBe(mockError.error); 
        done();},
      complete: () => {},
    });
  });

// TestCase:2(a) http getTodoById for getting one particular tasks/todos [success scenerio]
  it('should get one particular task by Id if success 2(a)', (done: DoneFn)=>{
    const mockId: number = 21;
    const mockTask: Task = { id: 21, title: "Team meeting", description: "Weekly sync-up with the product and development teams.", dueDate: new Date("2025-10-07"), dueTime: "10:30", completed: false, userId: 1 };

    httpClientSpy.get.and.returnValue(of(mockTask));

    service.getTodoById(mockId).subscribe({
      next: (task:Task) =>{
        expect(service.isLoading()).toBeTrue();
        expect(task).withContext('should return task if id is matched').toEqual(mockTask);
        expect(mockId).toEqual(mockTask.id);
      },
      error: (err) => {done.fail('Expected a task, not error');},
      complete: ()=>{
        expect(service.error()).toEqual(null);
        done();
      }
    });
  });

//  TestCase:2(b) http getTodoById for getting one particular tasks/todos [failure scenerio]
  it('should set error with error message failed 2(b)', (done: DoneFn)=>{
    const mockId:number = 12;

    httpClientSpy.get.and.returnValue(throwError(()=>mockError));
    

    service.getTodoById(mockId).subscribe({
      next: (task:Task) => {
        expect(service.isLoading()).toBeTrue();
        done.fail('Expecting error, not task');
        expect(task).toBeNull();
      },
      error: (mockError) => { 
        catchError(mockError); 
        expect(service.error()).toBe(mockError.error); 
        done();},
      complete: () => {},
    });
  });

// TestCase:3(a) http add todo if saveTodo function is success [success scenerio]
  it('should post the task to the db if saveTodo method succeed 3(a)', (done: DoneFn)=>{
    const mockTask:Task = { id: 21, title: "Team meeting", description: "Weekly sync-up with the product and development teams.", dueDate: new Date("2025-10-07"), dueTime: "10:30", completed: false, userId: 1 };

    httpClientSpy.post.and.returnValue(of(mockTask));

    service.saveTodo(mockTask).subscribe({
      next: (task:Task) =>{
        expect(service.isLoading()).toBeTrue();
        expect(task).withContext('should return task if successfully posted').toEqual(mockTask);
      },
      error: (err) => {done.fail('Expected a task, not error');},
      complete: ()=>{
        expect(service.error()).toEqual(null);
        done();
      }
    });
  });

// TestCase:3(b) http throw error if saveTodo function is failed [failure scenerio]
  it('should set error if saveTodo method failed 3(b)', (done: DoneFn)=>{
    const mockTask:Task = { id: 21, title: "Team meeting", description: "Weekly sync-up with the product and development teams.", dueDate: new Date("2025-10-07"), dueTime: "10:30", completed: false, userId: 1 };
    httpClientSpy.post.and.returnValue(throwError(()=>mockError));

    service.saveTodo(mockTask).subscribe({
      next: (task:Task) =>{
        expect(service.isLoading()).toBeTrue();
        expect(task).withContext('expected no task').toBeNull();
        done.fail('Expected an error, not a task');
      },
      error: (err) => {
        catchError(err);
        done();
        },
      complete: ()=>{
        expect(service.error()).toEqual(mockError.error);
      }
    });
  });

// TestCase:4(a) http put todo if updateTodo function is success [success scenerio]
  it('should update a particular task to the db if updateTodo method succeed 4(a)', (done: DoneFn)=>{
    const mockTask:Task = { id: 21, title: "Team meeting", description: "Weekly sync-up with the product and development teams.", dueDate: new Date("2025-10-07"), dueTime: "10:30", completed: false, userId: 1 };
    const mockId:number = 21;

    httpClientSpy.put.and.returnValue(of(mockTask));
    expect(mockId).toEqual(mockTask.id);

    service.updateTodo(mockId, mockTask).subscribe({
      next: (task:Task) =>{
        expect(task).withContext('should return task if successfully updated task').toEqual(mockTask);
      },
      error: (err) => {done.fail('Expected a task, not error');},
      complete: ()=>{
        expect(service.error()).toEqual(null);
        done();
      }
    });
  });

// TestCase:4(b) http throw error if saveTodo function is failed [failure scenerio]
  it('should set error if updateTodo method failed 4(b)', (done: DoneFn)=>{
    const mockId:number = 21;
    const mockTask:Task = { id: 21, title: "Team meeting", description: "Weekly sync-up with the product and development teams.", dueDate: new Date("2025-10-07"), dueTime: "10:30", completed: false, userId: 1 };
    httpClientSpy.put.and.returnValue(throwError(()=>mockError));
    expect(mockId).toEqual(mockTask.id);

    service.updateTodo(mockId, mockTask).subscribe({
      next: (task:Task) =>{
        expect(service.isLoading()).toBeTrue();
        expect(task).withContext('expected no task').toBeNull();
        done.fail('Expected an error, not a task');
      },
      error: (err) => {
        catchError(err);
        done();
        },
      complete: ()=>{
        expect(service.error()).toEqual(mockError.error);
      }
    });
  });

// TestCase:5(a) http delete todo if deleteTodo function is success [success scenerio]
  it('should delete a particular task in the db if deleteTodo method succeed 5(a)', (done: DoneFn)=>{
    const mockId:number = 21;

    httpClientSpy.delete.and.returnValue(of(void 0));

    service.deleteTodo(mockId).subscribe({
      next: () =>{
        expect(service.isLoading()).toBeTrue();
      },
      error: (err) => {done.fail('Expected a task, not error');},
      complete: ()=>{
        expect(service.error()).toEqual(null);
        done();
      }
    });
  });

// TestCase:5(b) http delete todo if deleteTodo function is failed [success scenerio]
  it('should delete a particular task in the db if deleteTodo method failed 5(b)', (done: DoneFn)=>{
    const mockId:number = 21;

    httpClientSpy.delete.and.returnValue(throwError(()=>mockError));

    service.deleteTodo(mockId).subscribe({
      next: () =>{
        expect(service.isLoading()).toBeTrue();
        done.fail('Expected a task, not error');
      },
      error: (err) =>{
        catchError(err);
        done();
        },
      complete: ()=>{
        expect(service.error()).toEqual(mockError.error);
      }
    });
  });
});
