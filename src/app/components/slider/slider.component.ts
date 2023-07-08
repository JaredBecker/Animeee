import { AfterViewInit, Component, Input } from '@angular/core';

@Component({
    selector: 'app-slider',
    templateUrl: './slider.component.html',
    styleUrls: ['./slider.component.scss'],
})
export class SliderComponent implements AfterViewInit {
    @Input() public animes?: string[];
    @Input() public title?: string;

    ngAfterViewInit(): void {
        console.log('view inited');
    }
}
