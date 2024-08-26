import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dashToSeparator',
  standalone: true
})
export class DashToSeparatorPipe implements PipeTransform {
  transform(value: string | undefined): string | undefined {
    return !value ? '' : value?.replace(/ /g, '-'); // return an empty string if the input value (like product_slug) is null.
  }
}
