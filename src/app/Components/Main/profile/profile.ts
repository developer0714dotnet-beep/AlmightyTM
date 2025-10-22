import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html'
})
export class Profile {
  name = signal<string | null>('');

  constructor(private route:ActivatedRoute){}

  ngOnInit(){
    this.route.params.forEach((param) =>
      this.name.set(param['name'])
    )}
}
