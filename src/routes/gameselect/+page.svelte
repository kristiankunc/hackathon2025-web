<script lang="ts">
	import Table from "$lib/components/ui/table.svelte";
</script>

<Table columns={["Level", "Name", "Score"]} rows={[{ Level: 1, Name: "Level 1", Score: "95%", link: `/game/${1}` }]} />
