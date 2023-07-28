import { Component, OnInit } from '@angular/core';
import { UserService } from '@shared/services/user.service';

@Component({
  selector: 'app-completed',
  templateUrl: './completed.component.html',
  styleUrls: ['./completed.component.scss']
})
export class CompletedComponent implements OnInit {
    public animes: any[] = [];
    public is_loading: boolean = true;

    constructor(
        private userService: UserService,
    ) { }


    public ngOnInit(): void {
        this.is_loading = true;

        this.userService.getUserProfileInfo()
            .then(user_info => {
                user_info?.anime_list.forEach(anime => {
                    if (anime.watch_type === 'completed') {
                        this.animes.push(anime);
                    }
                });

                this.is_loading = false;
            })
            .catch(() => this.is_loading = false);
    }
}
