import { ChangeDetectorRef, Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import * as _ from "lodash"

export interface URL {
  url: string
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'scrap-app';
  data:URL = {
    url :''
  }
  loader:boolean= false
  extracted_data:any;
  baseUrl = environment.baseUrl
  constructor(
    private _httpClient : HttpClient,
    private _changeDetectorRef: ChangeDetectorRef
  ){

  }

  processData =  _.debounce(this.getData, 3000,{})
  

  getData(){
    this.loader = true
    console.log(this.data.url)
    if (!(this.data.url.startsWith('https://www.flipkart.com') || this.data.url.startsWith('www.flipkart.com') || this.data.url.startsWith('flipkart.com'))){
      return alert("Please enter a valid url from flipkart!")
    }
    this._httpClient.post(this.baseUrl+"add_data?url="+this.data.url,{}).subscribe({
      next: (res:any) => {
        if(res?.data){
          this.extracted_data = res.data[0]
        }
        this.data.url = ''
        this.loader = false
        if (res?.message == 'invalid URL'){
          alert('Please enter a valid url')
        }
        this._changeDetectorRef.detectChanges()
      },
      error: err => {
        this.loader = false
        this.data.url = ''
      }
    })
  }
}
