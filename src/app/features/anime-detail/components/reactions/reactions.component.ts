import { Component } from '@angular/core';

@Component({
  selector: 'app-reactions',
  templateUrl: './reactions.component.html',
  styleUrls: ['./reactions.component.scss']
})
export class ReactionsComponent {
    public selected_sort_type: string = 'Popular';

    public updateSortType(value: string) {
        this.selected_sort_type = value;
    }
}
