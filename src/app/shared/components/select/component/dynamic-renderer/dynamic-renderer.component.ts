import { Component, ComponentFactoryResolver, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { dynamicComponentData } from './dynamic-renderer.interface';

@Component({
  selector: 'sr-dynamic-renderer',
  templateUrl: './dynamic-renderer.component.html',
  styleUrls: ['./dynamic-renderer.component.scss']
})
export class DynamicRendererComponent implements OnInit {
  @Input() data!: dynamicComponentData;
  private customComponent: any;

  @ViewChild('dynamicTarget', { read: ViewContainerRef, static: true }) target: any;

  constructor(private resolver: ComponentFactoryResolver, ) {}

  ngOnInit(): void {
    this.createComponent()
  }

  protected createComponent() {
    const componentFac = this.resolver.resolveComponentFactory(this.data.component);
    this.customComponent = this.target.createComponent(componentFac);
    if (this.data.handler) this.data.handler(this.customComponent.instance);
  }
}
