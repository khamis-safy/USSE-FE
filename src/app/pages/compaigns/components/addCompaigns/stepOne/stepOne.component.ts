import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ListData } from 'src/app/pages/manage-contacts/list-data';
import { ManageContactsService } from 'src/app/pages/manage-contacts/manage-contacts.service';

@Component({
  selector: 'app-stepOne',
  templateUrl: './stepOne.component.html',
  styleUrls: ['./stepOne.component.scss']
})
export class StepOneComponent implements OnInit {
  lists: ListData[] = [];
  selectAllStatus:number=0;
  selectedLists:number=0;
  addedLists:ListData[]=[];
  @Output() allSelected = new EventEmitter<ListData[]>;
  constructor( private listService:ManageContactsService) { }

  ngOnInit() {
    this.getLists();
  }
  getLists(search?:string) {
    let searchVal=search?search:"";

    this.listService.getList(this.listService.email, 100, 0,"",searchVal).subscribe(
      (res) => {
        let filterLlist = res.filter((e) => e.totalContacts != 0)
        this.lists = filterLlist;

      },
      (err) => {
      ////////////////////////////

      }
    )
  }

  onSearch(event:any){
    this.getLists(event.value);
  }

// on select list
onSelectList(state,list:ListData){

  if(state=="checked"){
    // change list status to checked
    list.isChecked="checked";

    list.selectionState=2;
    // incerease lists selection number
    this.selectedLists++
// this.getContacts(list,true)
      if(this.selectedLists==this.lists.length){
        // change state of select all checkbox
        this.selectAllStatus=2;


      }

      else{
        this.selectAllStatus=1
      }


      this.addedLists.push(list)
      this.allSelected.emit(this.addedLists)


  }
else{
  this.onDeslectList(list);
}

}

// on deselect list
onDeslectList(list:ListData){
  // change list status
  list.isChecked="";

  // decerease lists selection number
  this.selectedLists--;
  // change state of list check to be unchecked

  list.selectionState=0;

  // change state of select all checkbox


    if(this.selectedLists==0 ){
      this.selectAllStatus=0;

    }
    this.addedLists.splice(this.addedLists.indexOf(list),1)
    this.allSelected.emit(this.addedLists)



}

// on select all lists
selectAllLists(state){
  if(state=="checked"){

    this.selectedLists=this.lists.length;
    // change state of select all checkbox
    this.selectAllStatus=2;

    // change all lists and contacts state to be checked
      this.lists.map((list)=>{
        list.selectionState=2;
        list.isChecked="checked";
        // this.getContacts(list,true)
      });
      this.addedLists=[];
      this.lists.map((li)=>this.addedLists.push(li));
      this.allSelected.emit(this.addedLists);

  }
  else{
    this.onDeselectAllLists()
  }

}

// on deselect all lists
onDeselectAllLists(){

  this.selectedLists=0;
  // change all lists and contacts state to be un checked
  this.lists.map((list)=>{
    list.selectionState=0;
    list.isChecked="";

  });
  this.addedLists=[];
  this.allSelected.emit(this.addedLists)

}

clearLists(){

  this.addedLists=[];
  this.selectAllStatus=0;
  this.selectedLists=0;
  this.allSelected.emit(this.addedLists)

  this.lists.map((e)=>{e.selectionState=0; e.isChecked=""})

}
removeList(list:ListData){
  this.addedLists.splice(this.addedLists.indexOf(list),1)
  // change state of list check to be unchecked
  let found = this.lists.find((li)=>li.id==list.id);
  found.isChecked=""
  found.selectionState=0;
  this.allSelected.emit(this.addedLists)

  this.selectedLists--;
  this.selectAllStatus=1;

  // change state of select all checkbox


    if(this.selectedLists==0 ){
      this.selectAllStatus=0;

    }
}
}
