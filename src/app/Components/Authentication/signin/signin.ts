import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { loginUser } from '../../../interfaces/User';
import { UserService } from '../../../services/userServices/userService';


@Component({
  selector: 'app-signin',
  imports: [FormsModule, RouterLink],
  templateUrl: './signin.html'
})
export class Signin {
  // Services and Injections would be here
  userService:UserService = inject(UserService);
  router:Router = inject(Router);
  
  // Properties
  showPassword= signal<true | false>(false);
  userError = this.userService.userError;

  togglePassword(){
      this.showPassword.update((show) => !show);
  }

  confirmUser(field:loginUser){
    this.userService.loginUser(field).subscribe({
      next: (res) =>{
        this.userService.token.set(res.token);
        this.router.navigate(['/']);
      }
    })
  }

}
