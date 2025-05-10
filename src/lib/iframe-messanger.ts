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
