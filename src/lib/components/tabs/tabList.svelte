<script lang="ts">
	export let orientation: "horizontal" | "vertical" = "horizontal";
</script>

<div class="tab-list" role="tablist" aria-orientation={orientation}>
	<slot />
</div>
