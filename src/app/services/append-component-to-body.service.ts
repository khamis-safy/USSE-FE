import {
  Injectable,
  Injector,
  ComponentFactoryResolver,
  EmbeddedViewRef,
  ApplicationRef,
  ComponentRef,
} from '@angular/core';

export interface DynamicComponentInputsObject {
  [key: string]: any;
}

@Injectable({
  providedIn: 'root',
})
export class AppendComponentToBodyService {
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) {}

  appendComponentToBody(
    component: any,
    inputs: DynamicComponentInputsObject = {}
  ) {
    // 1. Create a component reference from the component
    const componentRef: ComponentRef<any> = this.componentFactoryResolver
      .resolveComponentFactory(component)
      .create(this.injector);

    // 2. Attach component to the appRef so that it's inside the ng component tree
    this.appRef.attachView(componentRef.hostView);

    // 3. set inputs
    Object.keys(inputs).forEach((key) => {
      //TODO: replace this with setInput after updating Angular to 14.1
      componentRef.instance[key] = inputs[key];
    });

    // 4. Get DOM element from component
    const domElem = (componentRef.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;

    // 5. Append DOM element to the body
    document.body.appendChild(domElem);

    return componentRef;
  }

  public destroyComponent(componentRef: any) {
    this.appRef.detachView(componentRef.hostView);
    componentRef.destroy();
  }
}

/*
There is currently no clean way to dynamically create a component with viewContainerRef.create() without having
to set something like <ng-template #ref></ng-template>.

This forces us to add <ng-template #ref></ng-template> in app.component.html, inject this service, and add a viewChild
there to set viewContainerRef in this service from there. Hence the use for the deprecated componentFactoryResolver.

Hoping by the time componentFactoryResolver is removed (probably by angular 16 or higher), a better solution would have come around.

** Chakra Ui seems to be using a similar approach: https://chakra-ui.com/docs/components/tooltip/usage with <div class="chakra-portal",
   we could adopt the same approach and channel all fixed elements inside it.
*/
