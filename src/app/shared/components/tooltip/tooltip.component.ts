import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';


import { DynamicTooltipComponent } from './dynamic-tooltip/dynamic-tooltip.component';
import { AppendComponentToBodyService } from 'src/app/services/append-component-to-body.service';

@Component({
  selector: 'sr-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
})
export class TooltipComponent implements AfterViewInit, OnDestroy {
  constructor(
    private appendComponentToBodyService: AppendComponentToBodyService
  ) {}

  @Input() iconClass: string = 'si-error'; // ignored if truncate = true
  @Input() text: string = '';
  @Input() truncate?: boolean = false;
  @Input() boundary: string = ''; // set to document by default
  @Input() set maxWidth(value: string) {
    if (value) this._maxWidth = value;
  }
  private _maxWidth: string = '250px';

  @ViewChild('parent') parent?: ElementRef<any>;

  private dynamicTooltipComponentRef: any;

  private dynamicTooltipInputs?: any;

  private gracePeriod?: any;

  private subscriptions: Subscription[] = [];

  ngAfterViewInit() {
    this.dynamicTooltipInputs = {
      parent: this.parent,
      text: this.text,
      boundary: this.boundary,
      maxWidth: this._maxWidth,
    };

  }

  public onMouseenter() {
    if (this.dynamicTooltipComponentRef) {
      this.destroyTooltip(); // guards against any residual tooltip .. if mouse leaves parent and reenters before gracePeriod is up, a new component will be created and after the grace period passes, the new component will be destroyed leaving the old component behind. This protects against that.
    }

    this.dynamicTooltipComponentRef =
      this.appendComponentToBodyService.appendComponentToBody(
        DynamicTooltipComponent,
        this.dynamicTooltipInputs
      );

    // subscribe to outputs
    this.subscriptions.push(
      this.dynamicTooltipComponentRef.instance.tooltipMouseenter.subscribe(
        (res: MouseEvent) => {
          clearTimeout(this.gracePeriod);
        }
      )
    );

    this.subscriptions.push(
      this.dynamicTooltipComponentRef.instance.tooltipMouseleave.subscribe(
        (res: MouseEvent) => {
          this.destroyTooltip();
        }
      )
    );
  }

  public onMouseleave() {
    this.gracePeriod = setTimeout(() => {
      this.destroyTooltip();
    }, 70);
  }

  private destroyTooltip() {
    this.appendComponentToBodyService.destroyComponent(
      this.dynamicTooltipComponentRef
    );

    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
    this.subscriptions = [];
  }

  ngOnDestroy() {
    if (this.dynamicTooltipComponentRef) this.destroyTooltip();
  }
}
