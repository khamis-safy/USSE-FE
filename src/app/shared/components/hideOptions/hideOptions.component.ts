import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-hideOptions',
  templateUrl: './hideOptions.component.html',
  styleUrls: ['./hideOptions.component.scss']
})
export class HideOptionsComponent implements OnInit, AfterViewInit, OnChanges {
  active: boolean = false;
  directions: any =
    [
      { title: this.translate.instant('left'), value: 'l' },
      { title: this.translate.instant('right'), value: 'r' }
    ];
    @Input() isTextSelected:boolean;
  @Input() optionsData: {
    selectedText: string,
    startPosition: number,
    endPosition: number,
    length: number
  }
  @Output() hideOptionsData = new EventEmitter<any>
  lettersCount:any=[];


  directionControl :any= new FormControl([],Validators.required);
  hiddenLettersControl:any = new FormControl([],Validators.required);
  startFromControl:any = new FormControl([],Validators.required);
  hiddenLetters:number;
  startFrom:any;
  form = new FormGroup({
    directionControl:this.directionControl,
    hiddenLettersControl:this.hiddenLettersControl,
    startFromControl:this.startFromControl,

  });
    ngAfterViewInit() {

  }
  constructor(private translate: TranslateService) { }
  ngOnChanges(changes: SimpleChanges): void {
    for(let i =0 ; i<=this.optionsData.length -1;i++){
      this.lettersCount.push(
        {title:i+1 , value: i+1}
      )
    }
  }

  ngOnInit() {
    this.form.patchValue({
      directionControl:this.directions[0],
      startFromControl:this.lettersCount[0]
    })
  }
  toggleActive() {
    this.active = !this.active
  }
  onSubmit(){
    event.preventDefault(); 

    this.hideOptionsData.emit({
      selectionStartPos:this.optionsData.startPosition,
      selectionEndPos:this.optionsData.endPosition,
      selectedText:this.optionsData.selectedText,
      maskingOptions:{
        startFrom:this.form.value.startFromControl.value,
        numberOfLetters:this.form.value.hiddenLettersControl.value,
        direction:this.form.value.directionControl.value
      }
    })
   
  }
}
