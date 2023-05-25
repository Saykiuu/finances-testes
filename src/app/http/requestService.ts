import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment.prod";
import { Observable } from "rxjs";


const httpOptions = {
    headers: new HttpHeaders( { 'Content-Type': 'application/json'})
};

@Injectable({
    providedIn: 'root'
})

export class RequestService{
    constructor(private http: HttpClient){}


    getRequest(rota:string) : Observable<any> {
        return this.http.get(environment.LOCALAPI + rota, httpOptions)
    }    

    postRequest(rota:string, valores:any) : Observable<any>  {
        return this.http.post(environment.LOCALAPI+rota, valores, httpOptions)
    }

}