import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class TransactionService{
	public result:any;

constructor(private _http: Http) { }
	public post(obj) { 
		return this._http.post('http://localhost:3000/api/transactions', obj)
					.map(result=>this.result = result.json());

	}
}