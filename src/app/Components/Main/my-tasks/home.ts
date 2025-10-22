import { Component, computed, inject, model, signal} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Todos } from '../../../services/taskServices/todoService';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { Task } from '../../../interfaces/Task';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { Tasks } from '../task-list/tasks';
import { PagedResult } from '../../../interfaces/pagedResult';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  imports: [FormsModule, CommonModule, ScrollingModule, NgbModule, Tasks]
})
export class Home {
  // Services and Injections
  private todoService = inject(Todos);

  // Properties
  incompleteTasks = signal<Task[]>([]);
  errorMessage = this.todoService.error;
  currentPage = model<number>(1);
  totalPages = model<number>(1);
  private pageSize =  signal<number>(5);

  ngOnInit() {
    this.getTask();
  }

  // Fetching all todos from the api
  getTask() {
    this.todoService.getTodoByPageIn(this.currentPage(), this.pageSize()).subscribe({
      next: (response:PagedResult) => 
        {
          this.totalPages.set(response.totalPages);
          this.incompleteTasks.update(() => response.todos);
        }
    });
  }

  // Updating a single todo with Id(Only checked)
  checked(id: number) {
    const task = this.incompleteTasks().find(t => t.id === id);
    if (task) {
      const updatedTask = { ...task, completed: !task.completed };
      this.todoService.updateTodo(id, updatedTask).subscribe({
        next:() => this.getTask(),
        error:(err) => {
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
      }
    });
  }

  // Logic to move between pages
  goToNext(){
      if(this.currentPage() < this.totalPages()){
          this.currentPage.set(this.currentPage()+1);
          this.getTask();
      }
  }

  goToPrev(){
      if(this.currentPage() > 1){
          this.currentPage.set(this.currentPage()-1);
          this.getTask();
      }
  }
}
