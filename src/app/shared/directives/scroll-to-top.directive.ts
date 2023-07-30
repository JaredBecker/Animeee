import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
    selector: '[appScrollToTop]'
})
export class ScrollToTopDirective {
    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
    ) { }

    @HostListener('window:scroll') public onWindowScroll() {
        if (window.scrollY > 300) {
            this.renderer.removeClass(this.el.nativeElement, 'd-none');
            this.renderer.addClass(this.el.nativeElement, 'd-flex');
        } else {
            this.renderer.removeClass(this.el.nativeElement, 'd-flex');
            this.renderer.addClass(this.el.nativeElement, 'd-none');
        }
    }

    @HostListener('click') public scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}
