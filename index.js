//
// Imports
//

import child_process from "node:child_process";

//
// Type Definitions
//

/**
 * @typedef {Object} MullvadAccount
 * @property {String} id The ID of the account on this device.
 * @property {String} deviceName The name of this device.
 * @property {Date} expiresAt The date that this account's credit expires.
 * @property {Number} expiresIn The amount of milliseconds until this account's credit expires.
 */

/**
 * @typedef {Object} MullvadVersionInfo
 * @property {String} currentVersion The current version of Mullvad.
 * @property {Boolean} isSupported Whether the current version is still supported.
 * @property {String} suggestedUpgrade The version Mullvad suggests upgrading to.
 * @property {String} latestStableVersion The latest stable version of Mullvad.
 */

//
// Exports
//

export const mullvad = {};

//
// General Functions
//

/**
 * Checks if Mullvad is installed.
 * 
 * @returns {Boolean}
 * @author Loren Goodwin
 */
mullvad.isInstalled = async function()
{
	const result = await mullvad.util.execute("version");

	return result != null;
};

/**
 * Gets information about the installed version of Mullvad.
 * 
 * @returns {MullvadVersionInfo}
 * @author Loren Goodwin
 */
mullvad.version = async function()
{
	const rawOutput = await mullvad.util.execute("version");

	const output = await mullvad.util.outputToObject(rawOutput);

	/** @type {MullvadVersionInfo} */
	const versionInfo =
	{
		currentVersion: output["Current version"],
		isSupported: output["Is supported"] == "true",
		suggestedUpgrade: output["Suggested upgrade"],
		latestStableVersion: output["Latest stable version"],
	};

	return versionInfo;
};

//
// Account Functions
//

mullvad.account = {};

/**
 * Gets information about the currently logged in Mullvad account.
 * 
 * @returns {MullvadAccount}
 * @author Loren Goodwin
 */
mullvad.account.get = async function()
{
	const rawOutput = await mullvad.util.execute("account get");

	if (rawOutput == "Not logged in on any account")
	{
		/** @type {MullvadAccount} */
		const noAccount =
		{
			id: "0000000000000000",
			deviceName: "No Account",
			expiresAt: 0,
			expiresIn: 0,
		};

		return noAccount;
	}

	const output = await mullvad.util.outputToObject(rawOutput);

	const expiresAt = new Date(output["Expires at"]).getTime();

	/** @type {MullvadAccount} */
	const account =
	{
		id: output["Mullvad account"],
		deviceName: output["Device name"],
		expiresAt,
		expiresIn: Math.max(0, expiresAt - Date.now()),
	};

	return account;
};

//
// Utilities
//

mullvad.util = {};

/**
 * Executes a mullvad command safely.
 * 
 * @param {String} command The command to execute.
 * @returns {Object?}
 * @author Loren Goodwin
 */
mullvad.util.execute = async function(command)
{
	try
	{
		const rawOutput = await new Promise((resolve) =>
		{
			child_process.exec(`mullvad ${ command }`, (error, stdout, stderr) =>
			{
				resolve(stdout);
			});
		});

		return typeof(rawOutput) == "string" ? rawOutput.trim() : "";
	}
	catch(error)
	{
		console.error("[Mullvad] An error occured:", error);

		return null;
	}
};

/**
 * Parses Mullvad output in to an object.
 * 
 * @param {String} output Output from a Mullvad command.
 * @returns {Object}
 * @author Loren Goodwin
 */
mullvad.util.outputToObject = function(output)
{
	const object = {};

	const lines = output.split(/\r?\n/);

	for (const line of lines)
	{
		const components = line.split(":");

		const key = components.shift().trim();

		const value = components.join(":").trim();

		object[key] = value;
	}

	return object;
};