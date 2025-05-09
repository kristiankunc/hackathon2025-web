export interface UnityMessage {
	action: string;
	args: { [key: string]: any };
}

interface PythonMessage {
	updatedAt: number;
	data: PythonMessageData;
}

export interface PythonMessageData {
	name: string;
	type: string;
	value: any;
}

export function sendMessageToUnity(iframe: HTMLIFrameElement, data: UnityMessage) {
	if (!iframe?.contentWindow) return;

	iframe.contentWindow.postMessage(
		{
			type: "jsToUnity",
			data: data
		},
		"*"
	);
}

export function sendDataToPython(elemntId: string, data: PythonMessageData) {
	console.log("Sending data to Python:", data);

	const element = document.getElementById(elemntId);
	if (!element) {
		console.error(`Element with id ${elemntId} not found`);
		return;
	}

	const message: PythonMessage = {
		updatedAt: Date.now() / 1000,
		data: data
	};

	element.innerHTML = JSON.stringify(message);
}
