import { Component, computed, inject, Injector, signal } from '@angular/core';
import { Tasks } from '../task-list/tasks';
import { Task } from '../../../interfaces/Task';
import { Todos } from '../../../services/taskServices/todoService';
import { HttpErrorResponse } from '@angular/common/http';
import { PagedResult } from '../../../interfaces/pagedResult';

@Component({
  selector: 'app-completed-tasks',
  imports: [Tasks],
  templateUrl: './completed-tasks.html'
})
export class CompletedTasks {
  completeTasks = signal<Task[]>([]);
  errorMessage = signal<HttpErrorResponse | null>(null);
  currentPage = signal<number>(1);
  pageSize =  signal<number>(5);
  totalPages = signal<number>(1);

  private injector = inject(Injector);
  private todoService = inject(Todos);


  
  ngOnInit() {
    this.getTask();
  }

  // Fetching all todos from the api
  getTask() {
    this.todoService.getTodoByPageComp(this.currentPage(), this.pageSize()).subscribe({
      next: (response:PagedResult) => 
        {
          this.totalPages.set(response.totalPages);
          this.completeTasks.set(response.todos );

          if(this.completeTasks().length === 0 && this.currentPage() > 1){
            this.currentPage.update(prev => prev - 1);
            this.getTask();
          }
        },
      error: (err) => {this.errorMessage.set(err);}
    });
  }

  // Updating a single todo with Id(Only checked)
  checked(id: number) {
    const task = this.completeTasks().find(t => t.id === id);
    if (task) {
      const updatedTask = { ...task, completed: !task.completed };
      this.todoService.updateTodo(id, updatedTask).subscribe({
        next:() => this.getTask(),
        error:(err) => {
          this.errorMessage.set(err);
          alert("Error updating task");
      }
      });
    }
  }
  
  // Delete a todo with the Id
  deleteTask(id: number) {
    this.todoService.deleteTodo(id).subscribe({
      next:() => this.getTask(),
      error:(err) => {
        alert("Error deleting task");
        this.errorMessage.set(err);
      }
    });
  }

  // Logic to move between pages
  goToNext(){
    if(this.currentPage() < this.totalPages()){
      this.currentPage.update(prev => prev + 1);
      this.getTask();
    }
  }

  goToPrev(){
    if(this.currentPage() > 1){
      this.currentPage.update(prev => prev - 1);
      this.getTask();
    }
  }
}
