//
// Interface
//

export interface MullvadAccount 
{
	/** The ID of the account on this device. */
	id : string;

	/** The name of this device. */
	deviceName : string;

	/** The date that this account's credit expires. */
	expiresAtDate : Date;

	/** The amount of milliseconds this account's credit expires in. */
	expiresInMilliseconds : number;

	/** The amount of seconds this account's credit expires in. */
	expiresInSeconds : number;
}