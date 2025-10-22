import { Component, inject, signal } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Task } from '../../../interfaces/Task';
import { Todos } from '../../../services/taskServices/todoService';

@Component({
  selector: 'app-add-task',
  imports: [FormsModule, NgbModule],
  templateUrl: './add-task.html'
})
export class AddTask {
  task = signal<Task>({} as Task);
  taskService = inject(Todos);
  router = inject(Router);

  addTask(task:Task) {
    const newTask:Task = {...task, dueTime:task.dueTime, completed: false, userId: 1};
    
    this.taskService.saveTodo(newTask).subscribe({
      next: () =>{
        alert("Task added Successfully");
        setTimeout(() => this.router.navigate(['/']), 1000);
        },
      error: err => alert("Unable to add Task: "+JSON.stringify(err))  
    });
  }
}
