<script lang="ts">
    import "../styles/styles.scss";
    import Navbar from '$lib/components/navbar.svelte';
</script>
  
  <Navbar />
  
  <main class="container">
    <slot />
  </main>
  