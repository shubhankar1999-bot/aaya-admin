import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { AppComponent } from '../app.component';
import { Admin, ServiceService } from '../services/service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  emp:Admin[]=[]
  constructor(private service:ServiceService,private app:AppComponent,private toast: HotToastService) { }

  ngOnInit(): void {
    this.getValidation()
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  submit() {
    if (!this.loginForm.valid) {
this.toast.show("Enter Valid Credentials")
      return;
    }

    const { email, password } = this.loginForm.value;
    this.getValidation()
    if(this.emp[0]!.email===email && this.emp[0]!.password===password){
      localStorage.setItem('token','jhgfjkgq37862937698ghagljgshdgf')
      this.app.getAunthenticated()
      this.toast.show("Logged In, Refresh Once")

    }
    else{
      this.toast.show("Check Email Or Password")
    }

  }

  getValidation(){
    this.service.getAdmin().subscribe((res: Admin[]) => {
      this.emp = res;
    })
  }

}
