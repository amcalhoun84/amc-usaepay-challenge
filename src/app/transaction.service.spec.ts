/** chai/mocha tests **/

import { TestBed, inject } from '@angular/core/testing';
import { TransactionService} from './transaction.service';
describe('TransactionService', () => {
	beforeEach(() => { 
		TestBed.configureTestingModule({
			providers: [TransactionService]
		});
	});

	it('should create a transaction', inject([TransactionService], (service: TransactionService) => { 
		expect(service).toBeTruthy(); /** makes sure the transaction service works, otherwise warn the developer that something is either not coded properly or the test is outside the standard parameters. **/
	}));
});