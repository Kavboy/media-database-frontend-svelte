<script>
  import MediaComponent from "../components/media/MediaComponent.svelte";
  import NoMedia from "../components/media/NoMedia.svelte";
  import { Container, Spinner } from "sveltestrap";
</script>

<Container id="mdb-media-news">
  <h2 class="mdb-page-header mdb-card-style mt-3 p-2">{title}</h2>
  {#await promise}
    <Spinner id="mdb-spinner" type="border" role="status" size="xl">
      <span class="sr-only">Loading...</span>
    </Spinner>
  {:then response}
    {#if Array.isArray(response?.res) && response?.status}
      {#each response.res as mediaObj}
        <MediaComponent media={mediaObj} />
      {/each}
    {:else if response?.status}
      {#each response.res.data as mediaObj}
        <MediaComponent media={mediaObj} />
      {/each}
    {/if}
  {:catch error}
    <NoMedia />
    <NoMedia />
  {/await}
</Container>

<style>
</style>
