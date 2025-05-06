<script lang="ts">
	export let onDragStart: () => void;
</script>

<button class="panel-divider" on:mousedown={onDragStart} aria-label="Drag divider"></button>
