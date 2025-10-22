import { inject, Injectable, signal, effect, OnInit } from "@angular/core";
import { loginUser, registerUser } from "../../interfaces/User";
import { catchError, finalize, Observable, tap, throwError } from "rxjs";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root'
})

export class UserService implements OnInit {
    private router = inject(Router);
    private http = inject(HttpClient); 
    private url = "https://localhost:7107/api/user";
    token = signal<string>(localStorage.getItem('token') || '');
    userError = signal<string | null>(null);

    constructor(){
        effect(() => {
            if(this.token()){
                localStorage.setItem('token', this.token());
            }else{
                localStorage.removeItem('token');
            }
        });
    }

    ngOnInit(){
        this.userError.set(null);
    }

    registerUser(userDet: registerUser): Observable<registerUser>{
        return this.http.post<registerUser>(this.url + "/signup", userDet).pipe(
            tap(() => this.clearError()),
            catchError((err) => this.handleError(err)),
            finalize(()=>{})
        );
    }

    loginUser(userDet: loginUser): Observable<{token:string}>{
        return this.http.post<{token:string}>(this.url + "/signin", userDet).pipe(
            tap(() => this.clearError()),
            catchError((err) => this.handleError(err)),
            finalize(()=>{})
        );
    }

    // Helper Methods
      private clearError(){
        this.userError.set(null);
      }
    
      private handleError(err:HttpErrorResponse){
        this.userError.set(err.error);
        return throwError(() => err);
      }
}