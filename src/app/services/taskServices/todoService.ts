import { HttpClient, HttpErrorResponse  } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Task } from '../../interfaces/Task';
import { catchError, finalize, Observable, of, tap, throwError } from 'rxjs';
import { PagedResult } from '../../interfaces/pagedResult';
import { Router } from '@angular/router';
import { UserService } from '../userServices/userService';

@Injectable({
  providedIn: 'root'
})
export class Todos {
  url = "https://localhost:7107/api/todo";
  private http = inject(HttpClient);
  private router = inject(Router);
  private userService = inject(UserService);

  token = this.userService.token;
  isLoading = signal(false);
  error = signal<string | null>(null);

  getTodo():Observable<Task[]>{
    this.setIsLoading(true);
    return this.http.get<Task[]>(this.url, this.AuthHeader()).pipe(
      tap(() => this.clearError()),
      catchError((err) => this.handleError(err)),
      finalize(()=>this.setIsLoading(false)));
  }

  getTodoById(id:number):Observable<Task>{
    this.setIsLoading(true);
    return this.http.get<Task>(`${this.url}/${id}`, this.AuthHeader()).pipe(
      tap(() => this.clearError()),
      catchError((err) => this.handleError(err)),
      finalize(()=>this.setIsLoading(false))
    );
  }

  getTodoBySearch(searchTerm: String):Observable<Task[]>{
    return this.http.get<Task[]>(this.url+"/search-task?SearchTerm="+searchTerm, this.AuthHeader()).pipe(
      tap(() => this.clearError()),
      catchError((err) => this.handleError(err)),
      finalize(()=>{})
    );
  }

  getTodoByPageIn(pageNumber: number, pageSize: number):Observable<PagedResult>{
    this.setIsLoading(true);
    return this.http.get<PagedResult>(this.url+`/pagedincompletedtasks?PageNumber=${pageNumber}&ItemsPerPage=${pageSize}`, this.AuthHeader()).pipe(
      tap(() => this.clearError()),
      catchError((err) => this.handleError(err)),
      finalize(()=>this.setIsLoading(false))
    );
  }

  getTodoByPageComp(pageNumber: number, pageSize: number):Observable<PagedResult>{
    this.setIsLoading(true);
    return this.http.get<PagedResult>(this.url+`/pagedcompletedtasks?PageNumber=${pageNumber}&ItemsPerPage=${pageSize}`, this.AuthHeader()).pipe(
      tap(() => this.clearError()),
      catchError((err) => this.handleError(err)),
      finalize(()=>this.setIsLoading(false))
    );
  }

  saveTodo(todo:Task):Observable<Task>{
    this.setIsLoading(true);
    return this.http.post<Task>(this.url,todo, this.AuthHeader()).pipe(
      tap(() => this.clearError()),
      catchError((err) => this.handleError(err)),
      finalize(()=>this.setIsLoading(false))
    );
  }

  deleteTodo(id:number):Observable<void>{
    this.setIsLoading(true);
    return this.http.delete<void>(`${this.url}/${id}`, this.AuthHeader()).pipe(
      tap(() => this.clearError()),
      catchError((err) => this.handleError(err)),
      finalize(()=>this.setIsLoading(false))
    );
  }

  updateTodo(id:number, todo:Task):Observable<Task>{
    return this.http.put<Task>(`${this.url}/${id}`, todo, this.AuthHeader()).pipe(
      tap(() => this.clearError()),
      catchError((err) => this.handleError(err)),
      finalize(()=>{})
    );
  }

  getRandomImage(id:number):Observable<Blob>{
    return this.http.get(
      `https://picsum.photos/id/${id}/700/300`,
      {responseType: 'blob'}
    ).pipe(
      tap(() => this.clearError()),
      catchError((err) => this.handleError(err)),
      finalize(()=>{})
    );
  }

  // Private setters
  private setIsLoading(value:boolean){
    this.isLoading.set(value);
  }

  private clearError(){
    this.error.set(null);
  }

  private handleError(err:HttpErrorResponse){
    
    if(err.status === 401){
      this.error.set("Session expired. Please login again.");
      this.router.navigate(['/signin']);
      return throwError(() => err);
    }

    if (err.status === 403) {
      this.error.set("You do not have permission to access this.");
      this.router.navigate(['/access-denied']);
      return throwError(() => err);
    }

    this.error.set(err.error || "An unexpected error occurred.");
    return throwError(() => err);
  }

  private AuthHeader(){
    return {
      headers:{
        Authorization: `Bearer ${this.token()}`
      }
    }
  }
}

