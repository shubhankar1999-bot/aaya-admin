import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'aaya-admin';
  displayStyle = "none";
  displayStyle2 = "block";
  constructor(public service:AuthService){}
  ngOnInit(): void {
    this.getAunthenticated()
  }

  getAunthenticated(){
    if(this.service.isLoggedIn()){
      this.displayStyle="block";
      this.displayStyle2="none";
    }
    else{
      this.displayStyle = "none";
  this.displayStyle2 = "block";
    }
  }

}

