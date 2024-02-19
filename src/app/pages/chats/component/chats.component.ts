import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TranslationService } from 'src/app/shared/services/translation.service';
import { ChatContactsComponent } from '../components/chat-contacts/chat-contacts.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SelectOption } from 'src/app/shared/components/select/select-option.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Observable, Subscription, concatMap,pipe, interval, throttleTime, combineLatest } from 'rxjs';
import { ChatById, Chats } from '../interfaces/Chats';
import { ChatsService } from '../chats.service';
import { DeleteModalComponent } from 'src/app/shared/components/delete-modal/delete-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MessagesService } from '../../messages/messages.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss'] ,
})
export class ChatsComponent implements OnInit, AfterViewInit{
  devices:any;
  deviceLoadingText:string='Loading ...';
  devicesData :any= new FormControl([]);
  message :any= new FormControl('',Validators.required);

  form = new FormGroup({
    devicesData:this.devicesData,
  });
  cursorPosition:any= 0
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
  isDelete:boolean=false;
  selectedChat:ChatById[]=[]
  selectedChatId:any;
  chatName:string='';
  targetPhoneNumber:string='';
  queryParamsSubscription: Subscription;
  devicesSub$:Observable<any>;
  listChatsSub$:Observable<any>;
  constructor( public dialog: MatDialog,
    private translationService:TranslationService,
    private authService:AuthService,
    private chatService:ChatsService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private messageService:MessagesService,
   private datePipe: DatePipe
    ){
      this.emojiForm = this.formBuilder.group({
        emojiInput: ['']
      });
  }
  initRouting() {
    // Assign the subscription to queryParamsSubscription
    // this.queryParamsSubscription = this.route.queryParams.subscribe(params => {
    //   if (params['chatId']) {
    //     this.router.navigateByUrl("/chats")


    //   } 
    // });
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
        // this.chatName=res[0]?.chat?.chatName;
        // this.targetPhoneNumber=res[0]?.chat?.targetPhoneNumber;
        setTimeout(() => {
          this.scrollToBottom();
        }, 0);

      }
    )

  }
  getDevices(){
    this.devicesSub$= this.authService.getDevices(this.authService.getUserInfo()?.email,10,0,"","");
    this.devicesSub$.subscribe(
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
  getListChats(){
  this.listChatsSub$= this.chatService.listChats(this.email , 100,0,this.searchKey,this.deviceId);
  this.listChatsSub$.subscribe(
      (res)=>{
        this.listChats=res;
        let chat;
        if(!this.selectedChatId){
          this.selectedChatId=res[0].chat.id;
          this.chatName=res[0]?.chat?.chatName;
          this.targetPhoneNumber=res[0]?.chat?.targetPhoneNumber;
          chat=res[0]
          this.getChatById(this.selectedChatId);
          this.updateQueryParams();
          this.listChats.map((chat)=>chat.active=false) ;   
          this.listChats[0].active=true
        }
        else{
          chat=this.listChats.find((chats)=>chats.chat.id == this.selectedChatId);
          this.chatName=chat.chat.chatName;
          this.targetPhoneNumber=chat.chat.targetPhoneNumber;
          this.getChatById(this.selectedChatId,'',true);
      
          this.listChats.map((chat)=>chat.active=false) ;   
          chat.active=true
          this.form.patchValue({
            devicesData: {
            title:chat?.device.deviceName,
            value:chat?.device.id,
            deviceIcon:chat?.device.deviceType
            }
  
            })

        }
        if(chat.unseenMessagesCount > 0){
          this.chatService.markChatAsRead(chat.chat.id).subscribe(
            (res)=>{
              chat.unseenMessagesCount=0;
            }
          )
        }
      }
    )
  }
resetForm(){
  this.messageForm.patchValue(
    {
      message:''
    }
  )
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
        this.getListChats()
        // this.updateQueryParams()
      }

    });
  }
  onSelect(device){
    this.deviceId=device.value;
    this.authService.selectedDeviceId=device.value;
    this.getListChats();

    }

    deleteChat(chat){
      this.isDelete=true;
      const dialogConfig=new MatDialogConfig();
      dialogConfig.height='50vh';
      dialogConfig.width='35vw';
      dialogConfig.maxWidth='100%';
      dialogConfig.minWidth='465px';
      dialogConfig.panelClass='custom-dialog-delete-style'
      dialogConfig.data = {
        chatData:{chat:chat}
      };
      dialogConfig.disableClose = true;
  
      const dialogRef = this.dialog.open(DeleteModalComponent,dialogConfig);
  
      dialogRef.afterClosed().subscribe(result => {
        this.isDelete=false;
        if(result){
          this.getListChats();

        }
      });
    }
    navigateToChat(chat:Chats){
      if(!chat.active){
        if(chat.unseenMessagesCount > 0){
          this.chatService.markChatAsRead(chat.chat.id).subscribe(
            (res)=>{
              chat.unseenMessagesCount=0;
            }
          )
        }
        this.listChats.map((chat)=>chat.active=false)      
        chat.active=true;
        if(!this.isDelete){
          this.chatName='';
        this.targetPhoneNumber='';
        this.selectedChat=[];
        this.selectedChatId=chat.chat.id;
        this.updateQueryParams()
        this.chatName=chat.chat.chatName;
        this.targetPhoneNumber=chat.chat.targetPhoneNumber;
        this.getChatById(this.selectedChatId)
        this.openChat=true;
        }
  
      }
      this.resetForm();

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
    sendMsg(event?){
      let message = this.messageForm.value.message;
      if(message.trim() !== ''){
        if(event){
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault(); 
          }  
        }
        this.selectedChat.push({
          id: this.selectedChatId,
          deviceid: this.deviceId,
          targetPhoneNumber: this.targetPhoneNumber,
          direction: true,
          chat:{chatName:this.chatName},
          msgBody: message,
          createdAt:String(this.convertToUTC(new Date())) ,
          // updatedAt: string,
          // isDeleted: false,
          // isSeened: boolean,
          status: 1,
          // applicationUserId:string,
          // msgType: string,
          // fileName: any,
          // fileUrl: any,
          // campaignId: any,
          // actionCount: any,
          // isReply: false,
          // isEnquiry: false,
          // enquiryQuestion: number,
          // botId: any,
          // isCampaignAction: false
        })
        // this.messageService.sendWhatsappBusinessMessage(this.deviceId,[this.targetPhoneNumber],message,null,this.email,[]).subscribe(
        //   (res)=>{
        //     this.selectedChat.push({
        //       id: this.selectedChatId,
        //       deviceid: this.deviceId,
        //       targetPhoneNumber: this.targetPhoneNumber,
        //       direction: true,
        //       chat:{chatName:this.chatName},
        //       msgBody: message,
        //       createdAt:String(new Date()) ,
        //       // updatedAt: string,
        //       // isDeleted: false,
        //       // isSeened: boolean,
        //       // status: number,
        //       // applicationUserId:string,
        //       // msgType: string,
        //       // fileName: any,
        //       // fileUrl: any,
        //       // campaignId: any,
        //       // actionCount: any,
        //       // isReply: false,
        //       // isEnquiry: false,
        //       // enquiryQuestion: number,
        //       // botId: any,
        //       // isCampaignAction: false
        //     })
        //     this.resetForm()
        //   }
        // )
        this.resetForm()
        setTimeout(() => {
          this.scrollToBottom();
        }, 0);   
      }
       
    }
    convertToUTC(timecontrol: any): any {
      const selectedTime = timecontrol;
  
      if (selectedTime) {
        const utcDate = new Date();
        utcDate.setHours(selectedTime.getHours());
        utcDate.setMinutes(selectedTime.getMinutes());
        utcDate.setSeconds(selectedTime.getSeconds());
  
        const utcFormattedDate = this.datePipe.transform(utcDate, 'yyyy-MM-dd HH:mm:ss', 'UTC');
  
        return utcFormattedDate;
      }
    }
}
