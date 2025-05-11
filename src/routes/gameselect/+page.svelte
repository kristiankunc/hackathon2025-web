<script lang="ts">
	import { goto } from "$app/navigation";
	import { onMount } from "svelte";

	type LevelStatus = "locked" | "unlocked" | "completed";

	interface Level {
		id: number;
		x: number;
		y: number;
		status: LevelStatus;
	}

	const NODE_RADIUS = 30;
	const LINE_GAP = 10;
	const MODAL_OFFSET_Y = 80;

	let levels: Level[] = [];
	let lines = [];

	const defaultLevels: Level[] = [
		{ id: 1, x: 0, y: 100, status: "unlocked" },
		{ id: 2, x: 150, y: 250, status: "locked" },
		{ id: 3, x: 275, y: 150, status: "locked" },
		{ id: 4, x: 450, y: 150, status: "locked" },
		{ id: 5, x: 600, y: 250, status: "locked" },
		{ id: 6, x: 750, y: 220, status: "locked" },
		{ id: 7, x: 1000 - NODE_RADIUS * 2, y: 180, status: "locked" }
	];

	onMount(() => {
		const stored = localStorage.getItem("games");
		if (stored) {
			levels = JSON.parse(stored);
		} else {
			levels = defaultLevels;
			localStorage.setItem("games", JSON.stringify(defaultLevels));
		}
	});

	$: lines =
		levels.length > 1
			? levels.slice(0, -1).map((a, i) => {
					const b = levels[i + 1];
					const dx = b.x - a.x;
					const dy = b.y - a.y;
					const dist = Math.hypot(dx, dy);
					const offsetX = (dx / dist) * (NODE_RADIUS + LINE_GAP);
					const offsetY = (dy / dist) * (NODE_RADIUS + LINE_GAP);

					return {
						x1: a.x + NODE_RADIUS + offsetX,
						y1: a.y + NODE_RADIUS + offsetY,
						x2: b.x + NODE_RADIUS - offsetX,
						y2: b.y + NODE_RADIUS - offsetY
					};
				})
			: [];

	let hoveredLevel: Level | null = null;
	let modalPos = { x: 0, y: 0 };

	function handleHover(level: Level) {
		hoveredLevel = level;
		modalPos = {
			x: level.x + NODE_RADIUS,
			y: level.y - MODAL_OFFSET_Y
		};
	}

	function handleClick(level: Level) {
		if (level.status !== "locked") {
			goto(`/game/${level.id}`);
		}
	}

	function clearHover() {
		hoveredLevel = null;
	}
</script>

<div class="map-wrapper">
	<div class="map-container">
		<svg class="connections">
			{#each lines as { x1, y1, x2, y2 }}
				<line {x1} {y1} {x2} {y2} class="line" />
			{/each}
		</svg>

		{#each levels as level}
			<button
				class="node {level.status}"
				style="left: {level.x}px; top: {level.y}px; width: {NODE_RADIUS * 2}px; height: {NODE_RADIUS * 2}px;"
				on:mouseenter={() => handleHover(level)}
				on:mouseleave={clearHover}
				on:click={() => handleClick(level)}
			>
				{level.id}
			</button>
		{/each}

		{#if hoveredLevel}
			<div class="modal" style="left: {modalPos.x}px; top: {modalPos.y}px">
				<strong>Level {hoveredLevel.id}</strong><br />
				Status: {hoveredLevel.status}
			</div>
		{/if}
	</div>
</div>
