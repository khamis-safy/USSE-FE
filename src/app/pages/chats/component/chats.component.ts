import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TranslationService } from 'src/app/shared/services/translation.service';
import { ChatContactsComponent } from '../components/chat-contacts/chat-contacts.component';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SelectOption } from 'src/app/shared/components/select/select-option.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Observable, Subscription, interval, throttleTime } from 'rxjs';
import { ChatById, Chats } from '../interfaces/Chats';
import { ChatsService } from '../chats.service';
import { DeleteModalComponent } from 'src/app/shared/components/delete-modal/delete-modal.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss'] ,
})
export class ChatsComponent implements OnInit, AfterViewInit{
  devices:any;
  deviceLoadingText:string='Loading ...';
  devicesData :any= new FormControl([]);
  message :any= new FormControl('');

  form = new FormGroup({
    devicesData:this.devicesData,
  });
  cursorPosition:any
  messageForm = new FormGroup({
    message:this.message,
  });
  deviceId:any
  // listChatsObservable$:Observable<Chats[]>;
  listChats:Chats[]=[];
  email=this.authService.getUserInfo()?.email;
  searchKey:string='';
  openChat:boolean=false;
  emojiForm: FormGroup;
  showEmoji: boolean = false;
  isEmojiClicked: boolean = false;
  @ViewChild('chatContainer') chatContainer: ElementRef;
  readonly scrollThrottleTime = 300; // Adjust as needed

  selectedChat:ChatById[]=[]
  selectedChatId:any;
  chatName:string='';
  targetPhoneNumber:string='';
  queryParamsSubscription: Subscription
  constructor( public dialog: MatDialog,
    private translationService:TranslationService,
    private authService:AuthService,
    private chatService:ChatsService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
    ){
      this.emojiForm = this.formBuilder.group({
        emojiInput: ['']
      });
  }
  initRouting() {
  
    // Assign the subscription to queryParamsSubscription
    this.queryParamsSubscription = this.route.queryParams.subscribe(params => {
      if (params['chatId']) {
        this.selectedChatId = params['chatId'];
        this.openChat = true;
        this.getChatById(this.selectedChatId,'',true);
        this.unSubscripQueryParam()
      } 
    });
  }
  unSubscripQueryParam(){
    if(this.queryParamsSubscription){
      this.queryParamsSubscription.unsubscribe();

    }
  }
  updateQueryParams(){
  
    this.router.navigateByUrl("/chats?chatId="+this.selectedChatId)
  }
  ngOnInit() {
    this.getDevices();
    console.log(this.openChat)
  }
  ngAfterViewInit() {
  }
  scrollToBottom() {
    const container = this.chatContainer.nativeElement;
    container.scrollTop = container.scrollHeight;
  }
  getChatById(chatId,search?,fromInit?)
  {
    let searchVal = search || ''
    this.chatService.getChatById(this.email,chatId,30,0,searchVal,this.deviceId) 
    .subscribe(
      (res)=>{
        res.sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
            return 0; // if either date is invalid, don't perform comparison
          }
          return dateA.getTime() - dateB.getTime(); // compare timestamps
        });
        this.selectedChat=res;
        this.chatName=res[0]?.chat?.chatName;
        this.targetPhoneNumber=res[0]?.chat?.targetPhoneNumber;
        setTimeout(() => {
          this.scrollToBottom();
        }, 0);
        if(fromInit){
          let deviceName = res[0].deviceid.match(/[^_]+_[^_]+_(.*?)_/)?.[1]?.replace(/_/g, ' ');;
          this.form.patchValue({
            devicesData: {
            title:deviceName,
            value:res[0]?.deviceid,
            deviceIcon:res[0].msgType
            }
  
            })
        }

      }
    )

  }
  getListChats(){
    this.chatService.listChats(this.email , 100,0,this.searchKey,this.deviceId).subscribe(
      (res)=>{
        this.listChats=res;
        console.log(this.selectedChatId)
        if(!this.selectedChatId){
          this.selectedChatId=res[0].chat.id;

          this.getChatById(this.selectedChatId);
          console.log('get chat by id called from getListChats')

          this.updateQueryParams();
        }
      }
    )
  }

  getDevices(){
    console.log("devices")

    this.authService.getDevices(this.authService.getUserInfo()?.email,10,0,"","").subscribe(
      (res)=>{
        let alldevices=res;


        this.devices = alldevices.map(res=>{
          return {
            title:res.deviceName,
            value:res.id,
            deviceIcon:res.deviceType
          }
        });
        if(this.devices.length==0){ 
          this.deviceLoadingText='No Results'

        }
        else{

          this.deviceId=res[0].id;


        if(this.authService.selectedDeviceId ==""){

          this.form.patchValue({
          devicesData: {
          title:alldevices[0]?.deviceName,
          value:alldevices[0]?.id,
          deviceIcon:alldevices[0].deviceType
          }

          })
        
        }
        else{
          let selected= this.devices.find((device)=>device.value==this.authService.selectedDeviceId)
          this.deviceId=this.authService.selectedDeviceId;
          this.form.patchValue({
            devicesData: {
            title:selected.title,
            value:selected?.value,
            deviceIcon:selected.deviceIcon
            }

            })
        }
        this.getListChats();
        this.initRouting()

      }},
        (err)=>{
        this.deviceLoadingText='No Results'

        })
  }
  onSearch(search){
    this.searchKey=search.value;
    this.getListChats()
  }
  addNewContact(){
    const currentLang=this.translationService.getCurrentLanguage()
    const dialogConfig=new MatDialogConfig();
    dialogConfig.height='100vh';
    dialogConfig.width='25vw';
    dialogConfig.maxWidth='450px';
    dialogConfig.minWidth='300px'
    dialogConfig.panelClass='add-new-chat-modal'
    dialogConfig.position =  currentLang=='ar'?{ right: '0'} :{ left: '0'} ;
    dialogConfig.direction = currentLang=='en'? "ltr" :"rtl";
    dialogConfig.data=this.deviceId;
    const dialogRef = this.dialog.open(ChatContactsComponent,dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.selectedChatId=result.id;
        this.chatName=result.chatName;
        this.targetPhoneNumber=result.targetPhoneNumber;
        this.updateQueryParams()
      }

    });
  }
  onSelect(device){
    this.deviceId=device.value;
    this.authService.selectedDeviceId=device.value;
    this.getListChats();

    }

    deleteChat(chat){
      const dialogConfig=new MatDialogConfig();
      dialogConfig.height='50vh';
      dialogConfig.width='35vw';
      dialogConfig.maxWidth='100%';
      dialogConfig.minWidth='465px';
      dialogConfig.data = {
        chatData:{chat:chat}
      };
      dialogConfig.disableClose = true;
  
      const dialogRef = this.dialog.open(DeleteModalComponent,dialogConfig);
  
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.getListChats();

        }
      });
    }
    navigateToChat(chat:Chats){
      
      this.chatName='';
      this.targetPhoneNumber='';
      this.selectedChat=[];
      this.selectedChatId=chat.chat.id;
      console.log('from navigateToChat')
      
      this.getChatById(this.selectedChatId)
      this.updateQueryParams()
      this.openChat=true;

    }
    closeChatPage(){
      this.openChat=true
    }
    toggleEmojiPicker() {
      this.showEmoji = !this.showEmoji;
    }
    showEmojiPicker() {
      if (!this.showEmoji) {
        this.showEmoji = true;
      }
    }
  
    getCursorPosition(e){
      this.cursorPosition = e.target.selectionStart;
    }
 
    addEmoji(event: any) {
      let emoji =event.emoji.native;
      let val = this.messageForm.value.message;

      const newMessage =val.slice(0, this.cursorPosition) + emoji + val.slice(this.cursorPosition);
      this.message.setValue(newMessage);
      this.isEmojiClicked = true;
      this.showEmoji = true;


      
    }
    chatIcon(chatName){
      if(parseInt(chatName)){

        return chatName.substring(chatName.length-2);
      }
      else{

        return chatName.trim().split(" ",2).map((e)=>e.charAt(0).toUpperCase()).join("");

      }
    }
    onScroll() {
      const container = this.chatContainer.nativeElement;
      if (container.scrollTop + container.clientHeight >= container.scrollHeight - 50 ) {
        this.getChatById(this.selectedChatId);
      }
    }
}
