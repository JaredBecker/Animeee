import { Component, Input } from '@angular/core';

import { NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tab-menu',
  templateUrl: './tab-menu.component.html',
  styleUrls: ['./tab-menu.component.scss']
})
export class TabMenuComponent {
    @Input() public anime?: any;

    public active: number = 1;

    public onNavChange(changeEvent: NgbNavChangeEvent) {
        // if (changeEvent.nextId === 3) {
        //     changeEvent.preventDefault();
        // }
    }
}