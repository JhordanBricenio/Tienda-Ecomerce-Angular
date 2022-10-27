import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'promocion'
})
export class PromocionPipe implements PipeTransform {

  transform(value: any, ...args: any[]): unknown {
    let promocion = Math.round(value-(value*args[0]/100));
    return promocion;
  }

}
