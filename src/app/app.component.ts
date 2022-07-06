import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import * as _ from "lodash"
import { FormControl, FormGroup } from '@angular/forms';

export interface URL {
  url: string
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'scrap-app';
  loader:boolean= false
  extracted_data:any;
  all_data:any;
  baseUrl = environment.baseUrl;
  initial:boolean = true
  data:URL = {
    url :''
  }
  urlForm: FormGroup = new FormGroup({
    url: new FormControl('')
  })


  constructor(
    private _httpClient : HttpClient,
    private _changeDetectorRef: ChangeDetectorRef,
  ){
    
  }

  keyUpChanges = _.debounce(this.validateURL,1000,{})

  validateURL(url:string){
      if (!(url.includes('flipkart'))) {
        this.extracted_data = null;
        this.loader = false
        this.urlForm.setValue({ url: '' })
        return alert("Please enter a valid url from flipkart!")
        }
      this.processData(url)
  }

  processData = _.debounce(this.getData, 3000, {})

  

  getData(url:string){
    if(url){
      this._httpClient.post(this.baseUrl+"add_data?url="+url.trim(),{}).subscribe({
        next: (res:any) => {
          if(res?.data){
            this.extracted_data = res.data[0]
          }
          this.urlForm.setValue({ url: '' })
          this.loader = false
          this.getAllData()
          if (res?.message == 'invalid URL'){
            alert('Please enter a valid url')
          }
          this._changeDetectorRef.detectChanges()
        },
        error: err => {
          this.loader = false
          this.urlForm.setValue({ url: '' })
        }
      })
    }
  }

  getAllData(){
    this._httpClient.get(this.baseUrl + "get_data").subscribe({
      next: (res: any) => {        
        this.all_data = [this.extracted_data,...res]
        this._changeDetectorRef.detectChanges()
      },
      error: err => {
        this.loader = false
        this.urlForm.setValue({ url: '' })
      }
    })
  }

  ngOnInit(): void {
   this.urlForm.get('url')?.valueChanges.subscribe(response=>{
    if(response){
      this.loader = true
      this.keyUpChanges(response)
    }
   })
  }
}
