import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replaceHyphens',
  standalone: true,
})
export class ReplaceHyphensPipe implements PipeTransform {
  transform(value: string): string {
    return value ? value.replace(/-/g, ' ') : value;
  }
}
