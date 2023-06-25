import { query } from '@angular/animations';
import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

declare function initToolTip():any;

@Injectable({
  providedIn: 'root'
})
export class PluginsService {
  public emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,16}$/;
  public passReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
  public textReg = /^[a-zA-Z0-9_-]{2,15}$/;

  private renderer:Renderer2
  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }
  initToolTip(){
    initToolTip();
  }
  ngOnInit(): void {
  }
  StartProgressBar(){
    let progBar = this.renderer.selectRootElement("#progress-bar",true);
    this.renderer.removeClass(progBar,"d-none")
  }
  StopProgressBar(){
    let progBar = this.renderer.selectRootElement("#progress-bar",true);
    this.renderer.addClass(progBar,"d-none")
  }
  StartSpinner(btn:any){
    btn = btn._elementRef.nativeElement;
    let spinner_ = this.renderer.createElement('div')
    spinner_.classList.add('mx-2','spinner-border','spinner-border-sm','primary-color-text')
    btn.appendChild(spinner_);
    btn.setAttribute("disabled","disabled")
  }
  StopSpinner(btn:any){
    btn = btn._elementRef.nativeElement;
    let spin = btn.lastElementChild;
    spin.remove();
    btn.removeAttribute("disabled")
  }
  startButtonLoad(btn:any){
    this.StartProgressBar()
    this.StartSpinner(btn)
  }
  stopButtonLoad(btn:any){
    this.StopProgressBar()
    this.StopSpinner(btn)
  }

  setData(data:any,name:string) {
    const jsonData = JSON.stringify(data)
    localStorage.setItem(name, jsonData)
  }
  getData(name:string) {
    let n:any = localStorage.getItem(name);
      return JSON.parse(n);
  }
  removeData(name:string) {
    localStorage.removeItem(name)
  }
  GetCssVar(variable:string) {
    let r:any = document.querySelector(':root');
    let rs = getComputedStyle(r);
    return rs.getPropertyValue(variable)
  }
  SetCssVar(variable:string,value:string) {
    let r:any = document.querySelector(':root');
    r.style.setProperty(variable, value);
  }
  toggleClass(tasks:any){
    tasks.forEach((element:any) => {
      // if(element.classList.contains("d-none")){
      //   element.classList.remove("d-none");
      //   element.classList.add(classShow);
      //   if(element.classList.contains(classHide)){
      //     element.classList.remove(classHide);
      //   }
      // }else{
      //   element.classList.add(classHide);
      //   element.classList.remove(classShow);
      //   setTimeout(()=>{
      //     element.classList.add("d-none");
      //   },300)
      // }
    });


  }
  togglePasszVis(vis:any,invis:any,pass:any){
    if(vis.classList.contains('d-none')){
      vis.classList.remove('d-none');
      invis.classList.add('d-none');
      pass.type="password"
    }else{
      invis.classList.remove('d-none');
      vis.classList.add('d-none');
      pass.type="text"
    }
  }
  deleteObjectModal(name:any){

  }
  successMessage(){
    // $('.modal').modal('hide');

    // $('#successMessage').modal('show');
  }
  failMessage(){
    // $('.modal').modal('hide');
    // $('#failMessage').modal('show');
  }
  closeModal(){
    // $('.modal').modal('hide');
  }
  // base64
  getBase64(file:any,multiple:any =false) {
    if(multiple){
      let arr:any =[]
      file.forEach((element:any) => {
        arr.push(
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(element);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
          })
        )
      });
      console.log(arr)
      return arr;

    }else{
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    }

  }
  getBase64Image(img:any){
    console.log(img)
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx:any = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("image/png");
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
  }
  ScrollLeft(element:any){
    console.log(element.scrollLeft);
    // element.scrollTo(0, 0)
    // element.scrollLeft = element.scrollLeft -270
    // console.log(element.scrollLeft);
    let Left:any = element.scrollLeft -270

    element.scrollTo({
      left: Left,
      behavior: 'smooth'
    });
  }
  ScrollRight(element:any){
    // console.log(element.scrollLeft);
    // element.scrollLeft = element.scrollLeft +270
    // console.log(element.scrollLeft);
    let Left:any = element.scrollLeft +270

    element.scrollTo({
      left: Left,
      behavior: 'smooth'
    });

  }
  toggleElement(element:any){
    element.classList.toggle("d-none");
  }
  randomNumber(min:number, max:number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  downloadUrl(url:any,name:any){
    let a:any = this.renderer.createElement('a');
    a.href = `data:application/pdf;base64,${url}`
    a.download = `${name}.pdf`
    a.click();
  }
  convertDataURIToBinary(dataURI:any) {
    // var BASE64_MARKER = ';base64,';
    // var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
    // var base64 = dataURI.substring(base64Index);
    // var raw = window.atob(base64);
    // var rawLength = raw.length;
    // var array = new Uint8Array(new ArrayBuffer(rawLength));

    // for(var i = 0; i < rawLength; i++) {
    //   array[i] = raw.charCodeAt(i);
    // }
    // return array;
  }
  pdfExtractText(url:any){
    // const pdfExtract = new PDFExtract();
    // const options = {}; /* see below */
    // pdfExtract.extract(url, options,(err,data) => {
    //   if (err){
    //     return err;
    //   }else{
    //     return data;

    //   }
    // })
  }
}
