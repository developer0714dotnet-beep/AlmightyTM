import { Component, computed, effect, inject, Injector, runInInjectionContext, signal, WritableSignal } from '@angular/core';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { FormsModule } from "@angular/forms";
import { Todos } from '../../../services/taskServices/todoService';
import { Task } from '../../../interfaces/Task';
import { HttpErrorResponse } from '@angular/common/http';
import { DateTime } from '../../../services/regionService/date-time';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [RouterLink, FormsModule, NgClass],
  templateUrl: './header.html'
})
export class Header {
  // Services
  private taskServices = inject(Todos);
  private injector = inject(Injector);
  private router = inject(Router);
  private regionService = inject(DateTime);

  user = signal({id: 1, userName: 'LeonJames', email:'leonJam@admin.com'});
  errorMessage = signal<HttpErrorResponse | null>(null);
  searchTerm:WritableSignal<String> = signal('');
  currentUrl = signal('');
  searchContainer = signal(false);
  regionOpen = signal(false);
  dateRegion = signal<'India' | 'US' | 'Asia' | ''>(''); // Default region

  showSearchComp = computed(() => 
    {
      const value = false;
      if(this.currentUrl().includes('/signin') || this.currentUrl().includes('/signup') || this.currentUrl().includes('/access-denied')){
        return value;
      }
      return true;
    });
  showHeader = computed(()=>
    {
      const value = true;
      if(this.currentUrl().includes('/signin') || this.currentUrl().includes('/signup')){
        return !value;
      }
      return value;
    });

  todos = signal<Task[]>([]);


  ngOnInit():void {
    this.router.events.subscribe(event => {
    if (event instanceof NavigationEnd) {
      this.currentUrl.set(event.url);
    }});
    runInInjectionContext(this.injector, ()=>{
      effect(()=>{
        const term = this.searchTerm().toLowerCase();
        this.dateRegion.set(this.regionService.dateTimeRegion())
        
        if(term){
            this.taskServices.getTodoBySearch(this.searchTerm()).subscribe({
              next: (tasks: Task[]) => this.todos.set(tasks),
              error: (err) => this.errorMessage.set(err)
            })
        } else{
          this.todos.set([]);
        }
      });
  });
  }

  // For reading the search input
  getSearchTerm(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  // For resetting the search input to blank after a redirection
  resetSearchTerm(id:number){
    this.router.navigate(['/taskDesc/'+id]);
    setTimeout(()=>this.searchTerm.set(''),100);
  }

  // To show/hide the search result container
  toggleSearchContainer(show: boolean) {
    this.searchContainer.update(()=> show);
    if(!show){
      this.searchTerm.update(()=>'');
    }
  }

  // To show/hide the search result container
  toggleRegionMenu() {
    this.regionOpen.update(x=> !x );
  }

  setRegion(region: string) {
    this.regionService.dateTimeRegion.set(region as 'India' | 'US' | 'Asia' | '');
    setTimeout(()=>this.regionOpen.set(false),200);
  }

}
