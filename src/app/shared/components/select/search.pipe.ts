import { Pipe, PipeTransform } from '@angular/core';
import { SelectOption } from './select-option.model';

@Pipe({
	name: 'search'
})
export class SearchPipe implements PipeTransform {
	transform(value: SelectOption[], searchText: string): any {
		if (!value) return null;
		if (!searchText) return value;

		searchText = searchText.toLowerCase();

		return value.filter((option) => {
			return option.title.toLowerCase().includes(searchText);
		});
	}
}
