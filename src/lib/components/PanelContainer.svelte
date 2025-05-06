<script lang="ts">
	import Panel from "./Panel.svelte";
	import Divider from "./Divider.svelte";
	import { onMount } from "svelte";

	let left = 50;
	let middle = 25;
	let right = 25;

	let draggingLeft = false;
	let draggingRight = false;

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
			left = Math.max(10, Math.min(newLeft, 80));
			const remaining = 100 - left;
			right = Math.max(10, Math.min(right, remaining - 10));
			middle = 100 - left - right;
		}

		if (draggingRight) {
			const fromRight = totalWidth - mouseX;
			const newRight = (fromRight / totalWidth) * 100;
			right = Math.max(10, Math.min(newRight, 80));
			const remaining = 100 - right;
			left = Math.max(10, Math.min(left, remaining - 10));
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
