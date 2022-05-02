<script lang="ts">
  import { Container, Spinner } from "sveltestrap";
  import NoMedia from "../components/media/NoMedia.svelte";
  import MediaComponent from "../components/media/MediaComponent.svelte";

  import { getNews } from "../apis/AxiosLaravel";
  import { errorStore } from "@src/stores/errorStore";

  let promise = getNews();

  promise.catch((error) => {
    if (!error.response) {
      errorStore.setNetworkError();
    } else {
      errorStore.setUnexpectedError();
    }
  });

  let title = "News";
</script>

<Container id="mdb-media-news">
  <h2 class="mdb-page-header mdb-card-style mt-3 p-2">{title}</h2>
  {#await promise}
    <Spinner id="mdb-spinner" type="border" role="status" size="xl">
      <span class="sr-only">Loading...</span>
    </Spinner>
  {:then medias}
    {#if medias.length <= 0}
      <NoMedia />
      <NoMedia />
    {/if}
    {#each medias as mediaObject, i}
      <MediaComponent media={mediaObject} />
    {/each}
  {:catch error}
    <NoMedia />
    <NoMedia />
  {/await}
</Container>

<style>
  .mdb-page-header {
    text-align: center;
    color: var(--primary-color);
  }

  :global(#mdb-spinner) {
    position: absolute;
    top: calc(100vh / 2);
    left: calc(100vw / 2 - 2rem);
    width: 4rem;
    height: 4rem;
    border-width: 0.35em;
  }
</style>
