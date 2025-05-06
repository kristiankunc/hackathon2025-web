<script lang="ts">
	import { onMount } from "svelte";
	let left = 50;
	let middle = 25;
	let right = 25;

	let isDraggingLeft = false;
	let isDraggingRight = false;

	function startDragLeft() {
		isDraggingLeft = true;
	}

	function startDragRight() {
		isDraggingRight = true;
	}

	function stopDrag() {
		isDraggingLeft = false;
		isDraggingRight = false;
	}

	function handleMouseMove(e: MouseEvent) {
		const container = document.getElementById("split-container");
		if (!container) return;

		const width = container.offsetWidth;
		const x = e.clientX;
		const percent = (x / width) * 100;

		if (isDraggingLeft) {
			left = Math.max(10, Math.min(percent, 80));
			const remaining = 100 - left;
			right = Math.max(10, Math.min(right, remaining - 10));
			middle = 100 - left - right;
		}

		if (isDraggingRight) {
			const fromRight = width - x;
			right = Math.max(10, Math.min((fromRight / width) * 100, 80));
			const remaining = 100 - right;
			left = Math.max(10, Math.min(left, remaining - 10));
			middle = 100 - left - right;
		}
	}

	onMount(() => {
		window.addEventListener("mousemove", handleMouseMove);
		window.addEventListener("mouseup", stopDrag);

		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("mouseup", stopDrag);
		};
	});
</script>

<div id="split-container" class="split-container">
	<div class="pane left" style="width: {left}%">
		<slot name="left" />
	</div>
	<div class="divider" on:mousedown={startDragLeft}></div>
	<div class="pane middle" style="width: {middle}%">
		<slot name="middle" />
	</div>
	<div class="divider" on:mousedown={startDragRight}></div>
	<div class="pane right" style="width: {right}%">
		<slot name="right" />
	</div>
</div>
