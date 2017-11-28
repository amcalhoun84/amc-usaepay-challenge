import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable, Subscriber } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class TransactionService{
	private baseUrl = '';
	public result:any;

constructor(private _http: Http) { }

	public post(obj) { 
		return this._http.post('http://localhost:3000/api/transactions', obj)
					.map(result=>this.result = result.json());

	}
}
