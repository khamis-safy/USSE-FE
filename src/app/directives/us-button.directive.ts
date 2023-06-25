import { Directive, ElementRef, HostListener, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[UsButton]'
})
export class UsButtonDirective {
  @Input() isLoading:any =false;
  @Input() isDark:any =false;

  @HostListener('click' , ["$event"]) onclick(e:any){
    this.createRipple(e)
  }
  constructor(private myElement:ElementRef,private renderer:Renderer2) { }
  ngOnChanges(): void {
    if(this.isLoading){
      this.renderer.addClass(this.myElement.nativeElement,"es-spinner-border")
    }else{
      this.renderer.removeClass(this.myElement.nativeElement,"es-spinner-border")
    }
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.renderer.addClass(this.myElement.nativeElement,"btn")
    this.renderer.addClass(this.myElement.nativeElement,"es-button")
    this.renderer.addClass(this.myElement.nativeElement,"dark")
  }
  createRipple(event:any) {
    const button = event.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
    circle.classList.add("ripple");

    const ripple = button.getElementsByClassName("ripple")[0];
    if (ripple) {
      ripple.remove();
    }
    button.appendChild(circle);
  }
}
