import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-nav-actions',
  templateUrl: './nav-actions.component.html',
  styleUrls: ['./nav-actions.component.scss']
})
export class NavActionsComponent implements OnInit {
  selectedItemsCount: number = 0;
  selectedItems:string[]=[];
  componentName:string;
  @Output() selectAllEvent = new EventEmitter<boolean>();
  @Output() deselectAllEvent = new EventEmitter<boolean>();
  menuItems: { name: string; function: () => void }[] ;
  @Output() deleteSelectedEvent = new EventEmitter<void>(); 
  constructor() { }
 
  ngOnInit() {
    if(this.componentName=='contacts'){
      this.menuItems = [
        { name: 'Select_All', function: () => this.selectAll() },
        { name: 'Remove_Lists', function: () => this.removeLists() },
        { name: 'delete', function: () => this.removeLists()}
      ];
    }
    
  }
  selectAll(){
    this.selectAllEvent.emit(true)
    this.menuItems=[
      { name: 'Remove_Lists', function: () => this.removeLists() },
      {name: 'delete', function: () => this.deleteAll()}]
  }
  removeLists(){
    console.log("lists removed")
  }
  deleteAll(){
    console.log("delete all")

  }
  onClose(){
    this.deselectAllEvent.emit(true)
  }
}
