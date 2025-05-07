<script lang="ts">
	export let columns: string[] = [];
	export let rows: { [key: string]: any, link?: string }[] = [];
</script>

<table class="table">
	<thead>
		<tr>
			{#each columns as col}
				<th>{col}</th>
			{/each}
		</tr>
	</thead>
	<tbody>
		{#each rows as row}
			{#if row.link}
				<tr class="clickable-row" on:click={() => window.location.href = row.link ?? '#'}>
					{#each columns as col}
						<td>{row[col]}</td>
					{/each}
				</tr>
			{:else}
				<tr>
					{#each columns as col}
						<td>{row[col]}</td>
					{/each}
				</tr>
			{/if}
		{/each}
	</tbody>
</table>
