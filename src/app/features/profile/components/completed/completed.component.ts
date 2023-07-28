import { Component, OnInit } from '@angular/core';
import { UserService } from '@shared/services/user.service';

@Component({
  selector: 'app-completed',
  templateUrl: './completed.component.html',
  styleUrls: ['./completed.component.scss']
})
export class CompletedComponent implements OnInit {
    constructor(
        private userService: UserService,
    ) {

    }
    public ngOnInit(): void {

    }
}
