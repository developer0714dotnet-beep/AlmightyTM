import { effect, Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })

export class DateTime {
  dateTimeRegion = signal<'India' | 'US' | 'Asia' | ''>('');

  constructor() {
    const storedRegion = localStorage.getItem('dateRegion') as 'India' | 'US' | 'Asia' | '' | null;
    this.dateTimeRegion.set(storedRegion ? storedRegion : 'India');

    effect(() =>{
      localStorage.setItem('dateRegion', this.dateTimeRegion());
    });

  }
}
