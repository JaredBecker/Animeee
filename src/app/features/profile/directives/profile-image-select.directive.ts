import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
    selector: '[appProfileImageSelect]'
})
export class ProfileImageSelectDirective {

    constructor(
        private el: ElementRef,
        private renderer: Renderer2
    ) { }

    @HostListener('click')
    public onClick() {
        const allLinks = document.querySelectorAll('.profile_pic_select');
        allLinks.forEach((link) => {
            this.renderer.removeClass(link, 'selected');
        });

        this.renderer.addClass(this.el.nativeElement, 'selected');
    }
}
