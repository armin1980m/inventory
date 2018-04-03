import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../services/auth.service'
import { Router } from '@angular/router';
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  spinnerRunning: boolean = false;

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
    this.auth.initFacebookLogin()
  }

  onSubmit(form) {

  }

  onFacebookLogin() {
    this.spinnerRunning=true;
    this.auth.facebookLogin()
      .subscribe((cred)=>{
        this.spinnerRunning=false;
        this.router.navigate(['/sale']);
        console.log(cred);
      },
      (err)=>{
        this.spinnerRunning=false;
        console.log(err);
      })
  }
}
