import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  AfterContentInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { PoppablePositionService, PoppableStyles } from 'src/app/services/poppable-position.service';



@Component({
  selector: 'sr-dynamic-tooltip',
  templateUrl: './dynamic-tooltip.component.html',
  styleUrls: ['./dynamic-tooltip.component.scss'],
})
export class DynamicTooltipComponent implements AfterContentInit {
  @Input() parent?: ElementRef<any>;
  @Input() text: string = '';
  @Input() boundary: string = ''; // set to document by default
  @Input() maxWidth: string = '';
  @Input() readMoreLink:string;

  @Output() tooltipMouseenter = new EventEmitter<MouseEvent>();
  @Output() tooltipMouseleave = new EventEmitter<MouseEvent>();

  constructor(private poppablePositionService: PoppablePositionService) {}

  public parentStyle: PoppableStyles = {};

  public tooltipStyle: PoppableStyles = {};

  public beakStyle: PoppableStyles = {};

  @ViewChild('tooltip') tooltip?: ElementRef<any>;

  @ViewChild('beak') beak?: ElementRef<any>;

  ngAfterContentInit() {
    const initialStyles = this.poppablePositionService.resetStyles(
      this.maxWidth
    );

    this.tooltipStyle = initialStyles.poppableStyle;
    this.beakStyle = initialStyles.beakStyle;

    setTimeout(() => {
      const styles = this.poppablePositionService.getStyles(
        this.parent,
        this.tooltip,
        this.beak,
        this.boundary,
        this.maxWidth
      );

      this.tooltipStyle = styles.poppableStyle;
      this.beakStyle = styles.beakStyle;
    });
  }

  public onMouseenter(e: MouseEvent) {
    this.tooltipMouseenter.emit(e);
  }

  public onMouseleave(e: MouseEvent) {
    this.tooltipMouseleave.emit(e);
  }
}
