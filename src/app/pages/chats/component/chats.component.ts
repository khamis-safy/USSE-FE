import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TranslationService } from 'src/app/shared/services/translation.service';
import { ChatContactsComponent } from '../components/chat-contacts/chat-contacts.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SelectOption } from 'src/app/shared/components/select/select-option.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Observable, Subscription, concatMap,pipe, interval, throttleTime, combineLatest } from 'rxjs';
import { ChatById, Chats, chatHub } from '../interfaces/Chats';
import { ChatsService } from '../chats.service';
import { DeleteModalComponent } from 'src/app/shared/components/delete-modal/delete-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MessagesService } from '../../messages/messages.service';
import { DatePipe } from '@angular/common';
import { ToasterServices } from 'src/app/shared/components/us-toaster/us-toaster.component';
import { isFileSizeNotAllowed } from 'src/app/shared/methods/fileSizeValidator';
import { TranslateService } from '@ngx-translate/core';

interface files{
  fileName:string,
  fileType:string,
  fileSize:number
}
@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss'] ,
})
export class ChatsComponent implements OnInit, AfterViewInit,OnDestroy{
  devices:any;
  deviceLoadingText:string='Loading ...';
  devicesData :any= new FormControl([]);
  message :any= new FormControl('',Validators.required);
  @ViewChild('fileInput') fileInputRef: ElementRef<HTMLInputElement>;
  uploadedAttachments:files[]=[];
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
  filesList: any=[];

  constructor( public dialog: MatDialog,
    private translationService:TranslationService,
    private authService:AuthService,
    private chatService:ChatsService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private messageService:MessagesService,
   private datePipe: DatePipe,
   private toaster:ToasterServices,
   private translate:TranslateService
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
    this.onRecieveMessages();
    this.onStatusChange();
    this.chatService.startConnection()

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
          this.openChat=true;
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
      this.openChat=true;

      if(!chat.active){
        this.clearInputData();
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
        this.messageService.sendWhatsappBusinessMessage(this.deviceId,[this.targetPhoneNumber],message,null,this.email,[]).subscribe(
          (res)=>{
            this.selectedChat.push({
              id: this.selectedChatId,
              deviceid: this.deviceId,
              targetPhoneNumber: this.targetPhoneNumber,
              direction: true,
              chat:{chatName:this.chatName,id:res[0]},
              msgBody: message,
              createdAt:String(this.convertToUTC(new Date())) ,
              status: 1,
              // updatedAt: string,
              // isDeleted: false,
              // isSeened: boolean,
              // status: number,
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
            let findChat = this.listChats.find((chat)=>chat.chat.id == this.selectedChatId);
            findChat.lastMessageContent=message;
            findChat.lastMessageStatus=1;
            this.resetForm();

          }
        )
        this.resetForm()
      
      }
      setTimeout(() => {
        this.scrollToBottom();
      }, 300); 
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

    backToChats(){
      this.clearInputData();
      this.filesList=[];
      this.openChat=false
    }
    toBase64(file){
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
    });
    }
    clearInputData(){
      const fileInput =this.fileInputRef.nativeElement.value='';
      }
  async onChangeFile(e) {
    e.preventDefault();
    let toBase64String: any = '';
    let reloadedFiles: string[] = [];
  
    for (let item of e?.dataTransfer?.files?.length ? e?.dataTransfer?.files : e?.target?.files?.length ? e?.target?.files : []) {
        toBase64String = await this.toBase64(item);
     
        const isReloaded = this.filesList.some(file => file.url === toBase64String);
  
        if(isFileSizeNotAllowed(item.size,this.authService.getAllowedFileSize())){
          this.toaster.warning(`${this.translate.instant("File_Size_Warning")} ${this.authService.getAllowedFileSize()} MB`)
        }
        // Check if the new file matches any existing file based on its base64 representation
  
        else if (isReloaded) {
          reloadedFiles.push(item.name); // Add the name of the reloaded file to the list
        } 
        
        else {
            this.filesList.push(
                {
                    name: item.name,
                    type: item.type,
                    url: toBase64String,
                    size: item.size
                }
            );
        }
        
    }
  

   // Log a message if any file was reloaded
   if (reloadedFiles.length > 0) {
    const reloadedFilesMessage = `( ${reloadedFiles.join(', ')} ) ${this.translate.instant("already_uploaded")}`;
    this.toaster.warning(reloadedFilesMessage)
  
  }
    
  
   this.clearInputData()
  }
  
    openFileUploader() {
      this.fileInputRef.nativeElement.click(); // Programmatically trigger file input click
    }
    onRecieveMessages(){
      this.chatService.receivedMessages$.subscribe((res)=>{
        if(res.userEmail === this.email){
          this.updateMessagesOnReceive(res.message);

        }
      })
    }
    onStatusChange(){
      this.chatService.updatedStatus$.subscribe(
        (res)=>{
          if(res.userEmail === this.email){
            this.updateMessageStatus(res.message);
  
          }
        }
      )
    }

    updateMessageStatus(newMessage){
      let message:chatHub=JSON.parse(newMessage)
      if(message.Deviceid == this.deviceId ){
        // update Status on list chats
        let findChat = this.listChats.find((chat)=>chat.chat.id == message.ChatId);
        if(findChat){
          findChat.lastMessageStatus=message.status;

        }

        // in case the message is sent from the current opend chat
        if(this.selectedChatId === message.ChatId){
          let foundMesg = this.selectedChat.find(chat => chat.chat.id === message.id);
          if (foundMesg) {
            foundMesg.status=message.status;
            foundMesg.updatedAt=message.updatedAt;
          }
          }

      }
        
      }

      updateMessagesOnReceive(message){
        let newMessage:chatHub=JSON.parse(message)

        if(newMessage.Deviceid == this.deviceId){
            // in case the message is sent from the current opend chat
            if(this.selectedChatId === newMessage.ChatId){
              this.selectedChat.push(newMessage);
              setTimeout(() => {
                this.scrollToBottom();
              }, 0);        
            }

            // in case the message is sent from closedChat and same device

              let foundChat = this.listChats.find((chat)=>chat.chat.id == newMessage.ChatId);
                if (foundChat) {
                  if(this.selectedChatId !== newMessage.ChatId){
                    foundChat.unseenMessagesCount+=1;

                  }
                  foundChat.lastMessageStatus=newMessage.status;
                  foundChat.lastMessageContent=newMessage.msgBody;
                  foundChat.lastMessageDate=newMessage.createdAt;
                  if(this.listChats.indexOf(foundChat) !== 0){
                    // Remove the element from its current position
                    this.listChats.splice(this.listChats.indexOf(foundChat), 1);
                    // Add the element to the beginning of the array
                    this.listChats.unshift(foundChat);
                  }
              
                }
                else{
                  this.listChats.unshift({
                    chat: {
                      id: newMessage.ChatId,
                      chatName: newMessage.chatName,
                      targetPhoneNumber: newMessage.targetPhoneNumber,
                      createdAt: newMessage.createdAt,
                    },
                    lastMessageDate: newMessage.createdAt,
                    lastMessageContent: newMessage.msgBody,
                    lastMessageDirection: false,
                    lastMessageStatus: null,
                    unseenMessagesCount: 1,
                  })
                }
            
        }
    
    }
    ngOnDestroy() {
      this.chatService.closeConnection()
      }
}
