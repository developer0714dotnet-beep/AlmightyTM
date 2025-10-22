import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NavigationEnd, Router } from '@angular/router';
import { Header } from './header';
import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { Todos } from '../../../services/taskServices/todoService';
import { of, throwError } from 'rxjs';
import { compileNgModule } from '@angular/compiler';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EnvironmentInjector, runInInjectionContext } from '@angular/core';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;
  let router:Router;
  let taskService:Todos;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header, HttpClientTestingModule],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    taskService = TestBed.inject(Todos);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

// TestCase:1 [getSearchTerm() method]
  it('should update search term when getsearchterm is called', ()=>{
    // Mocking input event
    const input = document.createElement('input');
    input.value = "TaskOne";
    const event = {target: input} as unknown as Event;

    component.getSearchTerm(event);

    expect(component.searchTerm()).toBe(input.value);
  });

// TestCase:2 [resetSearchTerm() method]
  it('should reset search term and navigate to desired taskDesc page', ()=>{
    const mockId = 2;
    jasmine.clock().install();
    spyOn(router,'navigate');

    component.resetSearchTerm(mockId);

    expect(router.navigate).toHaveBeenCalledWith(['/taskDesc/'+mockId]);
    jasmine.clock().tick(100);

    expect(component.searchTerm()).toBe('');
    jasmine.clock().uninstall();
  });

// TestCase:3 [if getTasks() method success]
  it('should get tasks when called',() =>{
    const mockTask = [
      { id: 1, title: "Finish project report", description: "Complete and submit the final report to the manager.", dueDate: new Date("2025-10-08"), dueTime: "17:00", completed: false, userId: 1 },
      { id: 2, title: "Team meeting", description: "Weekly sync-up with the product and development teams.", dueDate: new Date("2025-10-07"), dueTime: "10:30", completed: false, userId: 1 }
    ];
    const searchTerm = 'finish';

    spyOn(taskService, 'getTodoBySearch').and.returnValue(of([mockTask[0]]));

      component.ngOnInit();  // effect runs inside context
      component.searchTerm.set(searchTerm);
      fixture.detectChanges();

      expect(taskService.getTodoBySearch).toHaveBeenCalledWith(searchTerm);
      expect(component.todos()).toEqual([mockTask[0]]);
  });

// TestCase:3(a) [if getTasks() method fails]
  it('should alert and set errorMessage if fetch failed (getTask method)', () => {
    const mockError = new HttpErrorResponse({
        status:0,
        statusText: 'Unknown Error',
        error:'Fetch failed',
    });
    const searchTerm = 'finish';

    spyOn(taskService, 'getTodoBySearch').and.returnValue(throwError(()=> mockError));
      component.ngOnInit();  // effect runs inside context
      component.searchTerm.set(searchTerm);
      fixture.detectChanges();

    expect(taskService.getTodoBySearch).toHaveBeenCalledWith(searchTerm);
    expect(component.errorMessage()).toEqual(mockError);
  });

// TestCase:4 [ngOnInit is called]
  it('should run ngOnInit and get all tasks and set it to allTodos', ()=>{
    const mockEvent = new NavigationEnd(1, '/test-url', '/test-url');
    component.currentUrl.set('/');
    
    spyOnProperty(router, 'events', 'get').and.returnValue(of(mockEvent));

    component.ngOnInit();

    expect(component.currentUrl()).toBe('/test-url');
  });

// TestCase:5 [For computed signal todos]
  it('should empty the signal todos when searchTerm is empty', ()=>{
    component.todos.set([
      { id: 1, title: "Finish project report", description: "Complete and submit the final report to the manager.", dueDate: new Date("2025-10-08"), dueTime: "17:00", completed: false, userId: 1 },
      { id: 2, title: "Team meeting", description: "Weekly sync-up with the product and development teams.", dueDate: new Date("2025-10-07"), dueTime: "10:30", completed: false, userId: 1 }
    ]);

    component.ngOnInit();
    component.searchTerm.set('');
    fixture.detectChanges();

    expect(component.todos()).toEqual([])
  });

// Search Container toggle
  it('should toggle search container when toggleSearchContainer is called', ()=>{
    component.searchContainer.set(true);
    component.toggleSearchContainer(false);

    expect(component.searchContainer()).toBeFalse();
    expect(component.searchTerm()).toBe('');
  });

// Region Menu toggle
  it('should toggle region menu when toggleRegionMenu is called', ()=>{
    component.regionOpen.set(true);
    component.toggleRegionMenu();
    expect(component.regionOpen()).toBeFalse();
    component.toggleRegionMenu();
    expect(component.regionOpen()).toBeTrue();
  });

// Set Region
  it('should set region when setRegion is called', ()=>{
    const alertSpy = spyOn(window,'alert');
    jasmine.clock().install();

    component.dateRegion.set('Ind');
    component.regionOpen.set(true);
    component.setRegion('US');

    expect(component.dateRegion()).toBe('US');
    expect(component.regionOpen()).toBeTrue();
    component.setRegion('US');
    expect(alertSpy).toHaveBeenCalledWith('Region is already set to US');

    jasmine.clock().tick(500);
    expect(component.regionOpen()).toBeFalse();

    jasmine.clock().uninstall();
  });

});
