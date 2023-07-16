import { Directive, ElementRef, OnInit, Renderer2 } from '@angular/core';

@Directive({
    selector: '[appTopShadow]'
})
export class TopShadowDirective implements OnInit {
    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
    ) { }

    public ngOnInit(): void {
        const height  = this.el.nativeElement.offsetHeight;

        if (height === 400) {
            this.renderer.addClass(this.el.nativeElement, 'top_shadow');
        }
    }
}
