//
// Interface
//

/** An object that represents information for the currently installed version of Mullvad. */
export interface MullvadVersionInfo
{
	/** The current version of Mullvad. */
	currentVersion : string;

	/** Whether the currently installed version is still supported. */
	isCurrentVersionSupported : boolean;

	/** The next version that Mullvad suggests upgrading to. */
	suggestedVersion : string;

	/** The latest stable version of Mullvad available right now. */
	latestStableVersion : string;
}