import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header} from './Components/Common/header/header';
import { Navbar } from './Components/Common/navbar/navbar';
import { Todos } from './services/taskServices/todoService';
import { Footer } from './Components/Common/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Navbar, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // Services and Injections
  taskService = inject(Todos);

  // Properties
  isHidden = false;
  taskError = this.taskService.error;

  hide(){
    this.isHidden = true;
  }
}
