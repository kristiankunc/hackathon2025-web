<script lang="ts">
	import Panel from "./panel.svelte";
	import Divider from "./divider.svelte";
	import { onMount } from "svelte";

	let left = 50;
	let middle = 25;
	let right = 25;

	let draggingLeft = false;
	let draggingRight = false;

	const minWidth = 25;

	const startLeftDrag = () => (draggingLeft = true);
	const startRightDrag = () => (draggingRight = true);

	function stopDrag() {
		draggingLeft = false;
		draggingRight = false;
	}

	function onMouseMove(e: MouseEvent) {
		const container = document.getElementById("panel-container");
		if (!container) return;

		const totalWidth = container.offsetWidth;
		const mouseX = e.clientX;

		if (draggingLeft) {
			const newLeft = (mouseX / totalWidth) * 100;
			left = Math.max(minWidth, Math.min(newLeft, 100 - minWidth * 2));
			const remaining = 100 - left;
			right = Math.max(minWidth, Math.min(right, remaining - minWidth));
			middle = 100 - left - right;
		}

		if (draggingRight) {
			const fromRight = totalWidth - mouseX;
			const newRight = (fromRight / totalWidth) * 100;
			right = Math.max(minWidth, Math.min(newRight, 100 - minWidth * 2));
			const remaining = 100 - right;
			left = Math.max(minWidth, Math.min(left, remaining - minWidth));
			middle = 100 - left - right;
		}
	}

	onMount(() => {
		window.addEventListener("mousemove", onMouseMove);
		window.addEventListener("mouseup", stopDrag);
		return () => {
			window.removeEventListener("mousemove", onMouseMove);
			window.removeEventListener("mouseup", stopDrag);
		};
	});
</script>

<div id="panel-container" class="panel-container">
	<Panel width={`${left}%`}>
		<slot name="left" />
	</Panel>

	<Divider onDragStart={startLeftDrag} />

	<Panel width={`${middle}%`}>
		<slot name="middle" />
	</Panel>

	<Divider onDragStart={startRightDrag} />

	<Panel width={`${right}%`}>
		<slot name="right" />
	</Panel>
</div>
