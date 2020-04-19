import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BaseService } from './base.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

import { JwtHelperService } from "@auth0/angular-jwt";
import { UserJWT, userJWTdefualt } from '../interface/jwt-user.model';

import axios from "axios";

@Injectable()
export class AuthService extends BaseService {

    // private LOGIN_URI = `${environment.HOST_API}/auth/signIn`;
    private LOGIN_URI = `https://pkg-wfh-backend.azurewebsites.net/auth-scg/signIn`;
    // private LOGIN_URI = `api/CORP-IT/v1.1/ADAuth`;

    private jwtHelperService = new JwtHelperService;

    public userJWT: UserJWT = userJWTdefualt;

    public setUserJWT(userJWT) {
        this.userJWT = userJWT;
    }

    public getUserJWT(): UserJWT {
        return this.userJWT;
    }

    constructor(private http: HttpClient, public router: Router, ) {
        super();
    }

    login(payload: { username: string, password: string }): Promise<any> {
        
        const body = payload;

        const httpOptions = {
            headers: new HttpHeaders({
                // 'Content-type': 'application/x-www-form-urlencoded; charset=utf-8'
                'Content-type': 'application/json; charset=utf-8',
            })
        };

        return this.http.post<any>(this.LOGIN_URI, body, httpOptions).toPromise();
    }

    checkTime(form): Promise<any> {
        let url = "https://prod-06.southeastasia.logic.azure.com:443/workflows/04e96742e2b8486887187157b1ccf15e/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=kJ8CVGXLs5GmsF9vNxubGWlhKLRVobsmXAEb0hYqADs"
        // return this.http.post<any>(url, {properties:form,type:{}}).toPromise();
        return this.http.post<any>(url, form).toPromise();
    }

    logout() {
        localStorage.removeItem('token')
        this.router.navigate(['login'], {})
    }

    decodeToken() {
        let token = localStorage.getItem('token')

        let decode = this.jwtHelperService.decodeToken(token)
        // console.log(decode);
        this.setUserJWT(decode)

    }

    public isTokenExpired(): boolean {
        let token = localStorage.getItem('token')
        return this.jwtHelperService.isTokenExpired(token)
    }


}
