import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
    selector: '[appSwiperConfig]',
    providers: [{ provide: Window, useValue: window }]
})
export class SwiperConfigDirective {
    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        private window: Window,
    ) { }

    @HostListener('resize') public onResize() {
        const screen_width = this.window.innerWidth;

        if (screen_width <= 576) {
            this.renderer.setAttribute(this.el.nativeElement, 'slides-per-view', '2');
        } else if (screen_width <= 992) {
            this.renderer.setAttribute(this.el.nativeElement, 'slides-per-view', '3');
        } else {
            this.renderer.setAttribute(this.el.nativeElement, 'slides-per-view', '4');
        }
    }
}
