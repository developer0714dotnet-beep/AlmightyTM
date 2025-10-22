import { Component, inject, signal, WritableSignal } from "@angular/core";
import { Task } from "../../../interfaces/Task";
import { Todos } from "../../../services/taskServices/todoService";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { DatePerRegionPipe } from "../../../pipe/date-per-region-pipe";
import { DateTime } from "../../../services/regionService/date-time";

@Component({
    selector: 'app-taskDesc',
    templateUrl: './taskDesc.html',
    imports: [RouterLink, DatePerRegionPipe],
})

export class TaskDesc{
private taskServices:Todos = inject(Todos);
private param:ActivatedRoute = inject(ActivatedRoute);
private route:Router = inject(Router);
private regionService = inject(DateTime);

task:WritableSignal<Task | null> = signal(null);
id = signal(1);
regionDate = this.regionService.dateTimeRegion();
imageId = signal<number>(Math.floor(Math.random() * 30));
imageUrl = signal<string | null>("");

ngOnInit(){
    this.id.set(this.param.snapshot.params['id']);
    this.getUniqueTask();
    this.getRandomImage(this.imageId());
}

getUniqueTask(){
    this.taskServices.getTodoById(this.id()).subscribe({
    next: data => this.task.set(data),
    error: err => {
        alert('Error showing task!! Redirecting.....'+JSON.stringify(err));
        setTimeout(()=>this.route.navigate(['/']),1000);
    }
    });
}

getRandomImage(imageId:number){
    this.taskServices.getRandomImage(imageId).subscribe({
        next: (img) => {
            const imageObj = URL.createObjectURL(img);
            this.imageUrl.set(imageObj);
            console.log(this.imageUrl());
            
        }
    })
}

deleteTodo(id: number) {
    this.taskServices.deleteTodo(id).subscribe({
      next: () => {alert('Task Deleted');this.route.navigate(['/']);},
      error: err => alert("Unable to delete task: "+JSON.stringify(err))
    });
  }
}