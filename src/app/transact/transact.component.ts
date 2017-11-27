import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Customer } from './customer';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { TransactionService } from '../transaction.service';
import { FORM_DIRECTIVES, COMMON_DIRECTIVES } from "angular2/common";


@Component({
	selector: 'app-transact-test',
	templateUrl: './transact.component.html',
	styleUrls: ['./style.css']
})
export class TransactComponent implements OnInit { 

	@Output() submissionData = new EventEmitter();

	public maskDate = [/\d/, /\d/, '/', /\d/, /\d/]; 
	amounts:any[] = [{'amount': '38.36'}];
	selectedAmount = this.amounts[0];
	custom: string = "";
	model = new Customer("", "", "", "", "", "", "", "", "", "", "Bob's Widgets - #1 in Life Fulfillment Devices", this.amounts[0].amount);
	approved: boolean;
	declined: boolean;
	invalidCard: boolean;
	insufficientFunds: boolean;
	expired: boolean;
	refundApproved: boolean;
	carderror: boolean;
	error: boolean;
	doublerefund: boolean;
	widgetAmount: any; 
	refnum: string;

	constructor( private usaepayApi: TransactionService ) {}
	ngOnInit() { 
		this.widgetAmount = this.amounts[0];
		this.approved = false;
		this.invalidCard = false;
		this.insufficientFunds = false;
		this.expired = false; 
		this.declined = false;
		this.carderror = false;
	}
	clickNum() { 
		this.approved = false;
		this.invalidCard = false;
		this.insufficientFunds = false;
		this.expired = false;
		this.declined = false;
		this.carderror = false;
	}
	clickExpiration() { 
		this.approved = false;
		this.invalidCard = false;
		this.insufficientFunds = false;
		this.expired = false;
		this.declined = false;
		this.carderror = false;
	}
	clickRefund() { 
		this.refundApproved = false;
		this.error = false;
		this.doubleRefund = false;
	}
	public purchase() { 
		let obj = { 
			command: "cc:sale",
			amount : this.model.amount,
			amount_details: { 
				tax: "3.41",
				tip: "0.00"
			},
			creditcard: {
				cardholder: this.model.name,
				number: this.model.cardNum.toString(),
				expiration: this.model.expiration.replace(/[^\w\s]/gi, '').toString(),
				cvc: this.model.cvc.toString(),
				avs_street: this.model.address,
				avs_zip: this.model.ZIPCode.toString()
			},
			billing_address: { 
				street: this.model.address,
				city: this.model.billingCity,
				state: this.model.billingState,
				postalcode: this.model.ZIPCode.toString()
			},
			email: this.model.email,
			invoice: Math.floor(Math.random() * (100000)) + 1
			}
			this.usaepayApi.post(obj).subscribe(data => { 
				if(data.result === "Approved") {
					this.approved = true;
					this.declined = false;
					this.insufficientFunds = false;
					this.invalidCard = false;
					this.expired = false;
					this.carderror = false;
					
				} 
				else if(data.error === "Card Declined (00)") { 
					this.declined = true; 
					this.approved = false; 
					this.insufficientFunds = false;
					this.invalidCard = false;
					this.expired = false;
					this.carderror = false;
				} 
				else if(data.error === "Invalid Card Number (1)" || data.error === "Invalid Card Number (3)" || data.error === "Invalid Credit Card Number (1)") { 
					this.invalidCard = true;
					this.declined = false;
					this.insufficientFunds = false;
					this.expired = false;
					this.approved = false; 
					this.carderror = false;
				}
				else if(data.error === "Insufficient Funds on Card (T51)") {
					this.insufficientFunds = true;
					this.declined = false;
					this.invalidCard = false;
					this.expired = false;
					this.approved = false; 
					this.carderror = false;
					}
				else if (data.error === "Credit card has expired.") { 
					this.expired = true; 
					this.declined = false;
					this.insufficientFunds = false;
					this.invalidCard = false;
					this.approved = false;
					this.carderror = false;
				} 
				else if(data.error === "Invalid Pin" || data.error === "Transaction Not Permitted" || data.error === "Restricted Card" || data.error === "Excess withdrawal amount" || data.error === "Declined for CVV failure" || data.error == "Card Number was not between 13 and 16 digits.") { 
					this.carderror = true;
					this.expired = false;
					this.declined = false;
					this.insufficientFunds = false;
					this.invalidCard = false;
					this.approved = false;
						
				}

		});
		let response = this.usaepayApi.purchase();
		console.log("RESPONSE:" + response);

		response.subscribe(response => {
			this.submissionData.emit(response);
		}

	}

	public refund() {
		let obj = { 
			"command" : "refund",
			"transid" : this.model.refundNumber;
		}
		this.usaepayApi.post(obj).subscribe(data => {
			if(data.result === "Approved") { 
				this.refundApproved = true;
				this.error = false;
				this.doubleRefund = false;
			}
			else if(data.error === "Original transaction not an approved sale" || data.error === "Unable to find original transaction.") { 
				this.error = true; 
				this.approved = false; 
				this.doubleRefund = false; 
			}
			else if(data.error === "Amount exceeds original transaction amount.") {
				this.doubleRefund = true; 
				this.approved = false; 
				this.error = false; 
			} 
		})
	}
}