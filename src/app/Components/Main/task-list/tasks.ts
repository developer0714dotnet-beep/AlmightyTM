import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, effect, ElementRef, inject, Injector, input, model, OnInit, output, QueryList, runInInjectionContext, signal, ViewChildren } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { Task } from '../../../interfaces/Task';
import { Todos } from '../../../services/taskServices/todoService';
import { DatePerRegionPipe } from '../../../pipe/date-per-region-pipe';
import { DateTime } from '../../../services/regionService/date-time';

declare var bootstrap: any;

@Component({
  selector: 'app-tasks',
  imports: [ScrollingModule,CommonModule, RouterLink, NgbTooltip, DatePerRegionPipe],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css'
})
export class Tasks implements AfterViewInit{
@ViewChildren('toastElement') toastElements!: QueryList<ElementRef>;
// Services injection(DI)
taskService = inject(Todos);
router = inject(Router);
private regionService = inject(DateTime);

todos = input.required<Task[]>();
title = input.required<string>();
currentPage = input.required<number>();
region = this.regionService.dateTimeRegion;


// For Notification
private injector = inject(Injector);
NowDate = signal(new Date(Date.now())); 
overDueTasks = signal<{title:string, isOverDue:boolean, timeDue: string}[]>([]);
underDueTasks = signal<{title:string, timeLeft: string}[]>([]);

OnChecked =  output<number>();
OnDeleteTodo =  output<number>();

// After the View is initialized (For Toast Notification)
ngAfterViewInit(){
    runInInjectionContext(this.injector, ()=>{
        effect(()=>{
            const overTasks = this.checkOverDue();
            const underTasks = this.checkUnderDue();
            this.overDueTasks.set(overTasks.filter(t=> t.isOverDue));
            this.underDueTasks.set(underTasks.filter(t=> t.isUnderDue));
            
            // Show toast notification for overdue tasks
            setTimeout(()=>{
                this.toastElements.forEach((toastEle)=>{
                    const ts = toastEle.nativeElement;
                    const toast = new bootstrap.Toast(ts,{delay: 5000});
                    toast.show();
                });
            });
        });
    });
}



// To set over Due tasks
checkOverDue(){
    const currentDate = this.NowDate();
    return this.todos().filter(t => !t.completed)
        .map(t=> {
            const dueDate = new Date(t.dueDate+'T'+t.dueTime);
            const timeDiff = dueDate.getTime() - currentDate.getTime();
            const diffMins = Math.floor(timeDiff / (1000 * 60));
            const diffHours = Math.floor(diffMins / 60);
            const isOverdue = timeDiff < 0;

            return {
                ...t,
                isOverDue: isOverdue,
                timeDue: isOverdue ? `${Math.abs(diffHours) < 24 ? Math.abs(diffHours) : '' } overdue`
                : `${diffHours}h left`
            }
        });
}

// To get over Due tasks
getOverDueTasks(id: number):boolean{
  return this.overDueTasks().some(
    t => t.title === this.todos().find(td => td.id === id)?.title
  );
}

// To set under Due tasks
checkUnderDue(){
    const currentDate = this.NowDate();
    return this.todos().filter(t => !t.completed)
        .map(t=> {
            const dueDate = new Date(t.dueDate+'T'+t.dueTime);
            const timeDiff = dueDate.getTime() - currentDate.getTime();
            const diffMins = Math.floor(timeDiff / (1000 * 60));
            
            const isUnderDue = diffMins > 0 && diffMins <= 30;

            return {
                ...t,
                isUnderDue,
                timeLeft: isUnderDue ? `${diffMins} mins left` : ''
            }
        });
}


checked(id: number) {
    this.OnChecked.emit(id);

    
    
}

deleteTodo(id: number) {
    this.OnDeleteTodo.emit(id);
}

// For efficiency of virtual scrolling
trackById(index: number, todo: Task): number {
    return todo.id;
}

}
