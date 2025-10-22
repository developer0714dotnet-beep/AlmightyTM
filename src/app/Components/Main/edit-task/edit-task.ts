import { Component, inject, signal } from '@angular/core';
import { Todos } from '../../../services/taskServices/todoService';
import { FormsModule } from '@angular/forms';
import { Task } from '../../../interfaces/Task';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-edit-task',
  imports: [FormsModule],
  templateUrl: './edit-task.html'
})
export class EditTask {
  task = signal<Task>({} as Task);
  id = signal(1);
  errorMessage = signal<HttpErrorResponse | null>(null);
  taskService = inject(Todos);
  param = inject(ActivatedRoute);
  router = inject(Router);

  ngOnInit(){
    const paramId = this.param.snapshot.params['id'];
    this.id.set(paramId)
    this.getTaskById(paramId);
  }

// get Task method to retrieve single task using id
  getTaskById(id:number){
    this.taskService.getTodoById(id).subscribe({
      next:(task:Task) => {
        this.task.set(task);
      },
      error: err => {
        this.errorMessage.set(err);
        alert("Unable to Fetch task for editing: "+JSON.stringify(err));
        this.router.navigate(['/']);
      }
    });
  }

// UpdateTask method
  updateTask(task:Task){
    const updatedTask:Task = {...task, id: this.id(), completed: false, userId: task.userId};
    
    this.taskService.updateTodo(this.id(), updatedTask).subscribe({
      next:() => {
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1000);
        alert("Task updated Successfully!");
      },

      error: err => {
        this.errorMessage.set(err);
        alert("Unable to update Task: "+JSON.stringify(err))
      }
    
    });
  }
}
