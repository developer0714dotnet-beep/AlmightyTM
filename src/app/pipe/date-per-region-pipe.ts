import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'datePerRegion'
})
export class DatePerRegionPipe implements PipeTransform {

  transform(dateTime: unknown, region: string): Date | string | undefined {
    if(dateTime && region){
      const date = new Date(dateTime as string);
      if(isNaN(date.getTime())) return '';
      let options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
      switch(region){
        case 'Ind':
          options = { ...options, hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' };
          return new Intl.DateTimeFormat('en-IN', options).format(date).replace(',', ' | ');
        case 'US':
          options = { ...options, hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'America/New_York' };
          return new Intl.DateTimeFormat('en-US', options).format(date).replace(',', ' | ');
        case 'ISO':
          return date.toISOString().slice(0,16).replace('T', ' | ');
        default:
          return date.toString();
      }
  }
  return dateTime as string | undefined;
  }
}
