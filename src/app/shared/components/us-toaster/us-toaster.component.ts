import { Component, Input, OnInit, ViewContainerRef   } from '@angular/core';

let toasterCustomComponent:any;

let timeOut :any;

@Component({
  selector: 'us-toaster',
  templateUrl: './us-toaster.component.html',
  styleUrls: ['./us-toaster.component.scss']
})
export class ToasterServices implements OnInit {

  showToaster = true;

  toastEvents :any;

  toast!: ToasterServices;

  iconClass : any;

@Input() message:string = '';
@Input() state: 'error' | 'warning' | 'success' | '' = 'success';
@Input() icon:string = '';
@Input() duration: number = 5000;
progress = 100;
  constructor(private viewContainerRef : ViewContainerRef) { }


  ngOnInit(): void {
  }
  show(){
    toasterCustomComponent = this.viewContainerRef.createComponent(ToasterServices);
    toasterCustomComponent.instance.message = this.message;
    toasterCustomComponent.instance.state = this.state;
    toasterCustomComponent.instance.iconClass = this.iconClass;
    toasterCustomComponent.instance.showToaster = true;
    this.showToaster = toasterCustomComponent.instance.showToaster;

    timeOut = setTimeout(() => {
      this.showToaster = false;
      toasterCustomComponent.instance.showToaster = false;
      if(toasterCustomComponent){
        toasterCustomComponent.destroy();
      }
    }, this.duration);
  }
  getToasterData(){
    if(this.state == "success"){
      this.iconClass = "si-succeess";
    }
    else if(this.state == "error"){
      this.iconClass = "si-failure";
    }
    else if(this.state == "warning"){
      this.iconClass = "si-alert-triangle-outline";
    }
    this.show();
   }
  onTagClose(e?: MouseEvent): void {
      this.showToaster = false;
      toasterCustomComponent.instance.showToaster = false;
      if(toasterCustomComponent){
        toasterCustomComponent.destroy();
        clearTimeout(timeOut)
        timeOut=[]
      }
  }
  success(message:any){
    if(toasterCustomComponent){
        toasterCustomComponent.destroy();
    }
    this.message=  message;
    this.state = "success",
    this.getToasterData();
  }

  warning( message:any){
    if(toasterCustomComponent){
      toasterCustomComponent.destroy();
    }
    this.message=  message;
    this.state = "warning",
    this.getToasterData();
  }

  error( message:any){
    if(toasterCustomComponent){
      toasterCustomComponent.destroy();
    }
    this.message=  message;
    this.state = "error",
    this.getToasterData();
  }
}




