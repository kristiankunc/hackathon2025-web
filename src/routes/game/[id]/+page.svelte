<script lang="ts">
	import PanelContainer from "$lib/components/panels/panelContainer.svelte";
	import CodeEditor from "$lib/components/panels/codeEditor.svelte";
	import Chat from "$lib/components/panels/chat.svelte";
	import { PUBLIC_UNITY_INSTANCE_URL } from "$env/static/public";
	import pythonWrapper from "$lib/python/global_wrapper.py?raw";
	import getLevelCode from "$lib/python/get-level-code.js";
	import { onMount } from "svelte";
	import { sendDataToPython, sendMessageToUnity, type UnityMessage } from "$lib/iframe-messanger";
	import { getCookie, setCookie } from "$lib/cookies";
	import Button from "$lib/components/ui/button.svelte";
	import Modal from "$lib/components/ui/modal.svelte";

	let { data } = $props();
	let code = $state("");
	let isUnityReady = $state(false);
	let gameIframe: HTMLIFrameElement | undefined = undefined;
	let pyodide: any = null;
	let isPyodideReady = $state(false);

	// Asynchronous function to load Pyodide
	async function loadPyodideInstance() {
		try {
			// Wait for the Pyodide script to load
			await new Promise<void>((resolve, reject) => {
				const interval = setInterval(() => {
					// @ts-ignore
					if (window.loadPyodide) {
						clearInterval(interval);
						resolve();
					}
				}, 100);
				setTimeout(() => {
					clearInterval(interval);
					reject(new Error("Pyodide script failed to load"));
				}, 10000); // Timeout after 10 seconds
			});

			// @ts-ignore
			pyodide = await window.loadPyodide();
			isPyodideReady = true;
			console.log("Pyodide is ready");
		} catch (error) {
			console.error("Error loading Pyodide:", error);
			isPyodideReady = false;
		}
	}

	function handleResponse(message: string) {
		code = message;
	}

	async function onIframeMessage(event: MessageEvent) {
		console.log("(SVELTE) Message received from iframe", event.data);
		const message = event.data as { type: string; data: UnityMessage };

		if (!message.type || !message.data) return;

		switch (message.type) {
			case "unityToJs":
				handleUnityMessage(message.data);
				break;
		}
	}

	async function handleUnityMessage(unityData: UnityMessage) {
		console.log("Unity message received", unityData);

		switch (unityData.action) {
			case "ready":
				console.log("Unity is ready");
				isUnityReady = true;
				break;

			case "levelPass":
				handleLevelPass(data.levelId);
				break;

			case "setData":
				console.log("Setting data in Unity");
				const variableName = unityData.args.variableName;
				const variableValue = unityData.args.variableValue;
				const variableType = unityData.args.variableType;

				if (!variableName || !variableValue || !variableType) {
					console.error("Missing variable name, value or type");
					return;
				}

				sendDataToPython("python-data-exchange", {
					name: variableName,
					type: variableType,
					value: variableValue
				});

				break;

			case "levelPass":
				const gameId = data.levelId;
				handleLevelPass(gameId);
				break;

			default:
				console.error("Unknown action from Unity", unityData);
				break;
		}
	}

	function handleLevelPass(gameId: number): void {
		const gamesCookie = getCookie("games");
		if (gamesCookie) {
			const parsedGames = JSON.parse(gamesCookie);
			const index = parsedGames.findIndex((game: { id: number }) => game.id === gameId);

			if (index !== -1) {
				const currentGame = parsedGames[index];
				currentGame.status = "completed";

				// Unlock next level
				const nextGame = parsedGames[index + 1];
				if (nextGame && nextGame.status === "locked") {
					nextGame.status = "unlocked";
				}

				setCookie("games", JSON.stringify(parsedGames));
			}
		}
	}

	function sendActionToUnity(message: UnityMessage) {
		console.log("Sending action to Unity from python called, message:", message);
		sendMessageToUnity(gameIframe!, message);
	}

	onMount(async () => {
		// @ts-ignore
		window.sendActionToUnity = sendActionToUnity;
		// @ts-ignore
		globalThis.sendActionToUnity = sendActionToUnity;

		console.log(globalThis);

		window.addEventListener("message", onIframeMessage, false);

		await loadPyodideInstance();

		if (isPyodideReady) {
			pyodide.runPython(pythonWrapper);

			const levelCode = await getLevelCode(data.levelId);
			pyodide.runPython(levelCode);
		}

		if (!isUnityReady) {
			await new Promise<void>((resolve) => {
				const cleanup = $effect.root(() => {
					$effect(() => {
						if (isUnityReady) {
							cleanup();
							resolve();
						}
					});
				});
			});
		}

		sendMessageToUnity(gameIframe!, {
			action: "setLevel",
			args: {
				levelId: data.levelId
			}
		});
	});

	// modal logic
	let isModalOpen = $state(false);

	const closeModal = () => {
		isModalOpen = false;
	};

	onMount(() => {
		isModalOpen = true;
	});
</script>

<svelte:head>
	<link rel="stylesheet" href="https://pyscript.net/releases/2025.3.1/core.css" />
	<script src="https://cdn.jsdelivr.net/npm/pyodide@0.21.3/pyodide.js"></script>
	<script src="https://pyscript.net/releases/2025.3.1/core.js" type="module"></script>
</svelte:head>

<Modal isOpen={isModalOpen} {closeModal} title={data.levelTitle}>
	<p class="modal__text">{data.levelDescription}</p>
</Modal>

<PanelContainer>
	<div slot="left">
		<div class="game-section">
			<div class="game-container">
				<iframe src={PUBLIC_UNITY_INSTANCE_URL} bind:this={gameIframe} title="Hra" class="game"></iframe>
			</div>

			<div class="game-info">
				<span class="level-name">Level {data.levelId}</span>
				<div class="game-buttons">
					<Button
						onClick={() => sendMessageToUnity(gameIframe!, { action: "restartLevel", args: {} })}
						id="run-code-button"
						disabled={!isUnityReady || !isPyodideReady}
					>
						<span class="icon">▶️</span> Run
					</Button>

					<Button onClick={() => sendMessageToUnity(gameIframe!, { action: "restartLevel", args: {} })} disabled={!isUnityReady || !isPyodideReady}>
						<span class="icon">🔄</span> Reset
					</Button>
				</div>
			</div>
		</div>
	</div>
	<div slot="middle" class="code-editor">
		{#key code}
			<CodeEditor {code} levelId={data.levelId} />
		{/key}
	</div>
	<div slot="right">
		<Chat onResponse={handleResponse} />
	</div>
</PanelContainer>
