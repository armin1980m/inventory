import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import AppConfig from '../config/config';
import {
    CognitoUserPool,
    CognitoUserAttribute,
    CognitoUser,
    AuthenticationDetails,
    CognitoUserSession
} from 'amazon-cognito-identity-js';
import { subject } from 'aws-sdk/clients/sns';
import {
    FacebookService,
    InitParams,
    LoginOptions,
    LoginResponse
} from 'ngx-facebook';
import * as AWS from 'aws-sdk/global';
import 'amazon-cognito-js';


const POOL_DATA = {
    UserPoolId: AppConfig.userPoolId,
    ClientId: AppConfig.clientId
};

const userPool = new CognitoUserPool(POOL_DATA);

@Injectable()
export class AuthService {
    private registeredUser: CognitoUser;
    private userSession: CognitoUserSession;
    //this is a hack for cognito async
    private AWSSync: any
    private syncManager: any

    constructor(private fb: FacebookService) {
        //this is a hack for cognito async
        this.AWSSync = AWS;
    }

    /* Signup user by passing username, email,password,phone,name */
    signUpWithUsernameAndPassword(userregistration: { username: string, email: string, password: string, phone: string, name: string }): Observable<any> {
        const attrList: CognitoUserAttribute[] = [];
        const sb: Subject<any> = new Subject<any>();
        //set the attributes for registering into cognito pool
        const emailAttribute = {
            Name: 'email',
            Value: userregistration.email
        };

        const nameAttribute = {
            Name: 'name',
            Value: userregistration.name
        };

        const phoneAttribute = {
            Name: 'phone_number',
            Value: userregistration.phone
        };

        attrList.push(new CognitoUserAttribute(emailAttribute));
        attrList.push(new CognitoUserAttribute(nameAttribute));
        attrList.push(new CognitoUserAttribute(phoneAttribute));
        //sign in into userpool
        userPool.signUp(userregistration.username, userregistration.password, attrList, null, (err, result) => {
            if (err) {
                sb.error(err);
                return;
            }

            sb.next(result.user);
            this.registeredUser = result.user;
        });

        return sb.asObservable();
    }
    /* Confirm the created user by passing the username and secret code, this needs to happen after the user is created */
    confirmUser(username: string, code: string): Observable<any> {
        const sb: Subject<any> = new Subject<any>();
        const userData = {
            Username: username,
            Pool: userPool
        };

        const cognitUser = new CognitoUser(userData);

        cognitUser.confirmRegistration(code, true, (err, result) => {
            if (err) {
                sb.error(err);
                return;
            }

            sb.next(result.user);
        });

        return sb.asObservable();
    }
    /* Sign In user by entering username and password   */
    signIn(username: string, password: string): Observable<any> {
        let _sb: Subject<any> = new Subject<any>();

        const authData = {
            Username: username,
            Password: password
        };
        const authDetails = new AuthenticationDetails(authData);
        const userData = {
            Username: username,
            Pool: userPool
        };

        const cognitoUser = new CognitoUser(userData);

        cognitoUser.authenticateUser(authDetails, {
            onSuccess: (result: CognitoUserSession) => {
                this.getAuthenicatedUserId(result.getIdToken().getJwtToken(), AppConfig.cognitoFederationId)
                    .subscribe(data => {
                        cognitoUser.getUserAttributes((err, result) => {
                            if (err) {
                                console.log(err);
                                return;
                            }
                            let name: string, email: string;
                            result.map(att => {
                                if (att.getName() === 'name') {
                                    name = att.getValue();
                                }

                                if (att.getName() === 'email') {
                                    email = att.getValue();
                                }
                            });

                            this.saveUserData('userData', [{ name: 'name', value: name }, { name: 'email', value: email }])
                        })
                        _sb.next(data)
                    }
                        , err => _sb.error(err));
            },
            onFailure: (err) => {
                _sb.error(err);
            }
        });
        return _sb.asObservable();
    }

    /* This method get the credintial for the authenicated user */
    getAuthenicatedUserId(token: string, federatedLogin: string): Subject<any> {
        let _sub: Subject<any> = new Subject<any>();
        AWS.config.region = AppConfig.region;
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: AppConfig.identityPoolId,
            Logins: { [federatedLogin]: token }
        });
        AWS.config.region = AppConfig.region;
        (AWS.config.credentials as AWS.Credentials).get(err => {
            if (err) {
                _sub.error(err);
                return;
            }
            _sub.next(AWS.config.credentials);

        });

        return _sub;
    }

    /* Provide the credintial for the authenticated user */
    getAuthenicatedUserInfo(): any {
        return AWS.config.credentials;
    }

    private getAuthenticatedUser() {
        return userPool.getCurrentUser();
    }

    logout() {
        this.facebookLogout();
        this.cognitoLogout();
        AWS.config.credentials = null;
    }

    private cognitoLogout() {
        let userSession = this.getAuthenticatedUser();
        if (userSession) userSession.signOut();
    }

    isAuthenticated(): boolean {
        return (AWS.config.credentials as AWS.Credentials) != null && (AWS.config.credentials as AWS.Credentials).sessionToken != null ? true : false;
    }

    initFacebookLogin() {
        const params: InitParams = {
            appId: AppConfig.facebookAppId,
            xfbml: true,
            cookie: true,
            version: AppConfig.facebookAPIVer
        };

        this.fb.init(params);
    }

    facebookLogin(): Observable<any> {
        let _sb: Subject<any> = new Subject<any>();

        const options: LoginOptions = {
            scope: 'public_profile,email',
            return_scopes: true,
            enable_profile_selector: true
        };

        const loginResult: Subject<any> = new Subject<any>();

        this.fb.login(options)
            .then(res => {
                this.getAuthenicatedUserId(res.authResponse.accessToken, AppConfig.facebookFederationId).subscribe(
                    data => {
                        _sb.next(data)
                        //store the user date
                        this.fb.api('/me', 'get', { 'fields': 'name,email' })
                            .then(data => {
                                this.saveUserData('userData', [{ name: 'name', value: data.name }, { name: 'email', value: data.email }])
                            })
                            .catch(err => { console.log(err) });
                    }
                    , err => _sb.error(err));

            })
            .catch(e => _sb.error(e));
        return _sb.asObservable();
    }

    private facebookLogout() {
        this.fb.getLoginStatus().then(res => {
            if (res.status === "connected")
                this.fb.logout().then(_ => console.log('Logout of facebook'));
        });
    }

    private saveUserData(datasetName: string, data: { name, value }[]) {
        this.syncManager = new this.AWSSync.CognitoSyncManager();

        this.syncManager.openOrCreateDataset(datasetName, function (err, dataset) {
            if (err != null) {
                console.log(err);
                console.log('ERROR');
                return;
            }
            data.map(d => {
                dataset.put(d.name, d.value, function (err, record) {
                    console.log(err);
                    console.log(record);
                    dataset.synchronize({
                        onSuccess: function (data, newRecords) {
                            // Your handler code here
                        }

                    });

                });

            });
        });
    }

}
