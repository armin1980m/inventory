import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service'
import { FacebookService, InitParams, LoginOptions,LoginResponse } from 'ngx-facebook';
import * as AWS from 'aws-sdk/global';
import  'amazon-cognito-js';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  spinnerRunning: boolean = false;

  constructor(private authService: AuthService, public fb: FacebookService) {

    const params: InitParams = {
      appId: '2165863817025754',
      xfbml: true,
      cookie: true,
      version: 'v2.12'
    };

    this.fb.init(params);

  }



  ngOnInit() {
  }

  onSignup() {
    this.authService.signUpWithUsernameAndPassword({ username: 'XXXXXXX', email: 'YYYYYYYYY', password: 'ZZZZZZZZ', phone: 'HHHHHHHH', name: 'CCCCCCCCC' });
  }

  onConfirm() {
    this.authService.confirmUser('XXXXXX', 'YYYYYY');
  }

  onLogin() {
    this.authService.signIn('XXXXXX', 'ZZZZZZZZZZZ');
  }

  onGetCurrentUser() {
    //this.authService.getAuthenicatedUserId();
  }

  onLogout() {
    this.authService.logout();
  }

  onIsAuthenicated() {
    //this.authService.isAuthenticated().subscribe(data => console.log(data));
    console.log(this.authService.isAuthenticated());
  }

  onTurnOnSpinner() {
    this.spinnerRunning = true;
  }

  onFacebookAuth() {


    // // login with options
    // const options: LoginOptions = {
    //   scope: 'public_profile,user_friends,email,pages_show_list',
    //   return_scopes: true,
    //   enable_profile_selector: true
    // };
    // this.fb.login(options)
    //   .then(res => {

    //     AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    //       IdentityPoolId: 'us-west-2:acd3fef5-60f3-41c1-baec-1a08fc9f4e73',
    //       Logins: { 'graph.facebook.com': res.authResponse.accessToken }
    //     });
    //     AWS.config.region = 'us-west-2';
    //     console.log(res);
    //     (AWS.config.credentials as AWS.Credentials).get(err => {
    //       if (err) return console.log("Error", err);
    //       console.log(AWS.config.credentials);
          
    //       this.fb.api('/'+(<LoginResponse> res).authResponse.userID,'get', {fields: 'last_name,first_name,name,email'}).then(response =>console.log(response));
    //      // console.log("Cognito Identity Id", (<AWS.CognitoIdentityCredentials>AWS.config.credentials).identityId);
    //     });

    //     console.log(AWS.config.credentials);

    //     console.log(res);

    //   })
    //   .catch(e => console.log(e));
    this.authService.facebookLogin().subscribe(res=>{console.log(res)},err=>{console.log(err)});
  }

  onFacebookLogout(){
    //this.fb.logout().then(_=>console.log('Logout of facebook'));
    this.authService.logout();
  }
}
