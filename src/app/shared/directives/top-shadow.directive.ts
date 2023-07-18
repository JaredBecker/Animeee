import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
    selector: '[appTopShadow]'
})
export class TopShadowDirective implements OnInit {
    @Input() public height?: number;

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
    ) { }

    public ngOnInit(): void {
        const height  = this.el.nativeElement.offsetHeight;
        const max_height = this.height ? this.height : 400;

        if (height === max_height) {
            this.renderer.addClass(this.el.nativeElement, 'top_shadow');
        }
    }
}
