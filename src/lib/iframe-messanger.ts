export interface UnityMessage {
	action: string;
	args: { [key: string]: any };
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
