//
// Imports
//

import child_process from "node:child_process";

import { MullvadAccount } from "./types/MullvadAccount.js";
import { MullvadVersionInfo } from "./types/MullvadVersionInfo.js";

//
// Mullvad Utilities
//

export * from "./types/MullvadAccount.js";
export * from "./types/MullvadVersionInfo.js";

/**
 * Checks if Mullvad is currently installed.
 * 
 * @author Loren Goodwin
 */
export async function isMulladInstalled() : Promise<boolean>
{
	const result = await executeMullvadCommand("version");

	return result != null;
}

/**
 * Gets information about the currently installed version of Mullvad.
 * 
 * @author Loren Goodwin
 */
export async function getMullvadVersionInfo() : Promise<MullvadVersionInfo>
{
	const rawOutput = await executeMullvadCommand("version") as string;

	const output = await mullvadOutputToObject(rawOutput);

	const versionInfo : MullvadVersionInfo =
	{
		currentVersion: output["Current version"],
		isCurrentVersionSupported: output["Is supported"] == "true",
		suggestedVersion: output["Suggested upgrade"],
		latestStableVersion: output["Latest stable version"],
	};

	return versionInfo;
}

/**
 * Gets information about the currently logged in Mullvad account.
 * 
 * @author Loren Goodwin
 */
export async function getMullvadAccount() : Promise<MullvadAccount>
{
	const rawOutput = await executeMullvadCommand("account get") as string;

	if (rawOutput == "Not logged in on any account")
	{
		const noAccount : MullvadAccount =
		{
			id: "0000000000000000",
			deviceName: "No Account",
			expiresAtDate: new Date(0),
			expiresInMilliseconds: 0,
			expiresInSeconds: 0,
		};

		return noAccount;
	}

	const output = await mullvadOutputToObject(rawOutput);

	const expiresAtDate = new Date(output["Expires at"]);

	const account : MullvadAccount =
	{
		id: output["Mullvad account"],
		deviceName: output["Device name"],
		expiresAtDate: expiresAtDate,
		expiresInMilliseconds: Math.max(0, expiresAtDate.getTime() - Date.now()),
		expiresInSeconds: Math.max(0, Math.floor((expiresAtDate.getTime() - Date.now()) / 1000)),
	};

	return account;
}

/**
 * Executes a mullvad command safely.
 * 
 * @author Loren Goodwin
 */
export async function executeMullvadCommand(command : string) : Promise<unknown>
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
}

/**
 * Parses output from Mullvad into an object.
 * 
 * @author Loren Goodwin
 */
export async function mullvadOutputToObject(output : string) : Promise<{ [key : string] : string }>
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
}