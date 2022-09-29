# Mullvad Utilities
A collection of utilities for controlling the Mullvad VPN via its CLI.

This package was tested with Mullvad 2022.2 installed.

**Note**: The utilities provided by this module are limited at this time and it will have broader coverage of the Mullvad CLI in the future.

## Installation
Install the package with NPM:

```
npm install @donutteam/mullvad-utilities
```

## Usage
### mullvad.isInstalled
This function returns whether Mullvad is currently installed on the system.

```js
import { mullvad } from "@donutteam/mullvad-utilities";

// Will be true if the command "mullvad version" can be executed successfully
const isMullvadInstalled = await mullvad.isInstalled();
```

### mullvad.version
This function returns information about the installed version of mullvad:

```js
import { mullvad } from "@donutteam/mullvad-utilities";

const mullvadVersionInfo = await mullvad.version();

// This will return an object like this:
//	{
//		currentVersion: "2022.2",
//		isSupported: true,
//		suggestedUpgrade: "2022.4",
//		latestStableVerison: "2022.4",
//	}
```

### mullvad.account.get
This function returns details about the currently logged in Mullvad account.

```js
import { mullvad } from "@donutteam/mullvad-utilities";

const currentAccount = await mullvad.account.get();

// If you're logged in, this will return something like this:
//	{
//		// The ID of the account
//		id: "1234123412341234",
//
//		// The name of the device
//		deviceName: "Tasty Donut",
//
//		// The date the accounts credit expires in milliseconds
//		expiresAt: 1664482097,
//
//		// The amount of account credit remaining in milliseconds
//		//	This will be 0 if there is NO credit currently
//		expiresIn: 12345678,
//	}

// If you're not logged in, this will return this account object instead:
//	{
//		id: "0000000000000000",
//
//		deviceName: "No Account",
//
//		expiresAt: 0,
//
//		expiresIn: 0,
//	}
```

## License
[MIT](https://github.com/donutteam/npm-mullvad-utilities/blob/main/LICENSE.md)