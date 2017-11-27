/** This is much like the MongoDB/Mongoose Model Schema **/

export class Customer { 
	constructor(
		public name: string,
		public email: string.
		public cardNum: string,
		public cvc: string,
		public expiration: string,
		public address: string,
		public ZIPCode: string,

		/** These are strictly to test a 'billing address' **/
		public billingAddress: string,
		public billingCity: string,
		public billingState: string,

		/** And finally, the amount **/

		public description: string,
		public amount: string
		
	) { }
}