import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { registerUser } from '../../../interfaces/User';
import { UserService } from '../../../services/userServices/userService';

@Component({
  selector: 'app-signup',
  imports: [FormsModule, RouterLink],
  templateUrl: './signup.html'
})
export class Signup {
  //Services and Injections would be here
  userService:UserService = inject(UserService);
  router:Router = inject(Router);

  // Properties
  showPassword= signal<true | false>(false);
  userError = this.userService.userError;

  togglePassword(){
      this.showPassword.update((show) => !show);
  }
  addUser(field:registerUser){
    this.userService.registerUser(field).subscribe({
      next: () =>{
        alert("User Registered Successfully");
        this.router.navigate(['/signin']);
      },
      error: (err) =>{
        console.error("Error registering user: ", err);
      }
    })
  }

}
