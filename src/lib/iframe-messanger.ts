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

export function sendMessageToUnity(iframe: HTMLIFrameElement, messageData: UnityMessage) {
	if (!iframe?.contentWindow) return;

	console.log("Sending message to Unity:", messageData);

	iframe.contentWindow.postMessage(
		{
			type: "jsToUnity",
			data: messageData
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
