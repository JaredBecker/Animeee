import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-franchise',
  templateUrl: './franchise.component.html',
  styleUrls: ['./franchise.component.scss']
})
export class FranchiseComponent implements OnInit {
    public ngOnInit(): void {
        console.log('franchise loaded');
    }
}
