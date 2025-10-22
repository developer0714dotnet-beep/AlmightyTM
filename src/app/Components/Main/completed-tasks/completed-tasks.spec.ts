import { ComponentFixture,TestBed} from '@angular/core/testing';

import { CompletedTasks } from './completed-tasks';
import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { Todos } from '../../../services/taskServices/todoService';
import { of, throwError } from 'rxjs';
import { Task } from '../../../interfaces/Task';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PagedResult } from '../../../interfaces/pagedResult';


describe('CompletedTasks', () => {
  let component: CompletedTasks;
  let fixture: ComponentFixture<CompletedTasks>;
  let taskService: Todos;
  const mockResponse:PagedResult = {
      "totalCount": 15,
      "totalPages": 3,
      "currentPage": 1,
      "pageSize": 5,
      "todos": [
        {
          "id": 1,
          "title": "Learn EF Core",
          "description": "Understand DbContext, migrations, and seeding",
          "dueDate": new Date("2025-10-15"),
          "dueTime": "12:30:00",
          "completed": true,
          "userId": 0
        },
        {
          "id": 2,
          "title": "Implement Authentication",
          "description": "Add JWT authentication for users",
          "dueDate": new Date("2025-10-17"),
          "dueTime": "14:30:00",
          "completed": true,
          "userId": 1
        }
]};
    const currentPage = 1;
    const pageSize = 5;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [CompletedTasks, HttpClientTestingModule],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompletedTasks);
    component = fixture.componentInstance;
    taskService = TestBed.inject(Todos);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test case for getTask() method: Case-1
  it('should get todos from api end and set todos (getTask method)', ()=>{

    spyOn(taskService, 'getTodoByPageComp').and.returnValue(of(mockResponse));
    component.getTask();

    expect(taskService.getTodoByPageComp).toHaveBeenCalledOnceWith(currentPage, pageSize);
    expect(component.completeTasks()).toBe(mockResponse.todos);

  });

  // Case-2
  it('should alert and set errorMessage if fetch failed (getTask method)', () => {
    const mockError = new HttpErrorResponse({
        status:0,
        statusText: 'Unknown Error',
        error:'Fetch failed',
    });
    const alertSpy = spyOn(window,'alert');

    spyOn(taskService, 'getTodoByPageComp').and.returnValue(throwError(()=> mockError));
    component.getTask();

    expect(taskService.getTodoByPageComp).toHaveBeenCalledOnceWith(currentPage, pageSize);
    expect(component.errorMessage()).toEqual(mockError);
  });

  // Test case for checked() method: Case-1 (Task with id is found)
  it('should update task with completed if task with id is found (checked method)', () =>{
    const mockTask = [
      { id: 1, title: "Finish project report", description: "Complete and submit the final report to the manager.", dueDate: new Date("2025-10-08"), dueTime: "17:00", completed: false, userId: 1 },
      { id: 2, title: "Team meeting", description: "Weekly sync-up with the product and development teams.", dueDate: new Date("2025-10-07"), dueTime: "10:30", completed: false, userId: 1 }
    ];
    const mockFiltered:Task = { ...mockTask[1], completed: !mockTask[1].completed };

    component.completeTasks.set(mockTask);
    spyOn(taskService, 'updateTodo').and.returnValue(of(mockTask[1]));
    spyOn(component, 'getTask').and.stub();
    component.checked(2);

    expect(taskService.updateTodo).toHaveBeenCalledWith(2, mockFiltered);
    expect(component.getTask).toHaveBeenCalled();
  });

  // Case-2 (Error test case)
  it('should alert and set errorMessage if update failed (checked method)', () => {
    const mockId = 12;
    const mockError = new HttpErrorResponse({
        status:0,
        statusText: 'Unknown Error',
        error:'Update failed',
    });
    const alertSpy = spyOn(window,'alert');
    component.completeTasks.set([
    { id: 12, title: 'Test', description: 'Task', dueDate: new Date(), dueTime: '10:00', completed: false, userId: 1 }
  ]);

    spyOn(taskService, 'updateTodo').and.returnValue(throwError(()=> mockError));
    component.checked(mockId);

    expect(taskService.updateTodo).toHaveBeenCalled();
    expect(component.errorMessage()).toEqual(mockError);
    expect(alertSpy).toHaveBeenCalledOnceWith("Error updating task");
  });

  // Case-3 (If task with Id is not found)
  it('should not call updateTodo if task with the id is not found (checked method)' , () =>{
    const mockTask = [
      { id: 1, title: "Finish project report", description: "Complete and submit the final report to the manager.", dueDate: new Date("2025-10-08"), dueTime: "17:00", completed: false, userId: 1 },
      { id: 2, title: "Team meeting", description: "Weekly sync-up with the product and development teams.", dueDate: new Date("2025-10-07"), dueTime: "10:30", completed: false, userId: 1 }
    ];
    const mockId:number =  121;

    spyOn(component, 'getTask').and.stub();
    spyOn(taskService, 'updateTodo');

    component.checked(mockId);

    expect(taskService.updateTodo).not.toHaveBeenCalled();
    expect(component.getTask).not.toHaveBeenCalled();
    
  });

  // Test cases for deleteTask() method: Case-1
  it('should delete a todo with the provided Id (deleteTask method)', ()=>{
    const mockId:number = 12;

    spyOn(taskService, 'deleteTodo').and.returnValue(of(void 0));
    spyOn(component, 'getTask').and.stub();

    component.deleteTask(mockId);

    expect(taskService.deleteTodo).toHaveBeenCalledWith(mockId);
    expect(component.getTask).toHaveBeenCalled();
  });

  // Case-2 (deleteTask method)
  it('should alert and set errorMessage if delete failed (deleteTask method)', () => {
    const mockError = new HttpErrorResponse({
        status:0,
        statusText: 'Unknown Error',
        error:'Delete failed',
    });
    const alertSpy = spyOn(window,'alert');
    const mockId = 12;

    spyOn(taskService, 'deleteTodo').and.returnValue(throwError(()=> mockError));
    component.deleteTask(mockId);

    expect(taskService.deleteTodo).toHaveBeenCalledOnceWith(mockId);
    expect(component.errorMessage()).toEqual(mockError);
    expect(alertSpy).toHaveBeenCalledOnceWith("Error deleting task");
  });

  // ngOnInit test (Final case)
  it('should have been called ngOnInit', () =>{
    const mockTask = [
      { id: 1, title: "Finish project report", description: "Complete and submit the final report to the manager.", dueDate: new Date("2025-10-08"), dueTime: "17:00", completed: false, userId: 1 },
      { id: 2, title: "Team meeting", description: "Weekly sync-up with the product and development teams.", dueDate: new Date("2025-10-07"), dueTime: "10:30", completed: false, userId: 1 }
    ];
    component.completeTasks.set(mockTask);
    spyOn(component, 'getTask');

    component.ngOnInit();

    expect(component.getTask).toHaveBeenCalled();
    expect(component.completeTasks()).toEqual(mockTask);
  });
});
