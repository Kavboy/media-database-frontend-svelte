<script lang="ts">
  import MediaComponent from "../components/media/MediaComponent.svelte";
  import NoMedia from "../components/media/NoMedia.svelte";
  import { Container, Spinner } from "sveltestrap";
  import { getMedia } from "@src/apis/AxiosLaravel";

  export let id: string;

  const promise = getMedia(id);
</script>

<Container id="mdb-media-full">
  {#await promise}
    <Spinner id="mdb-spinner" type="border" role="status" size="xl">
      <span class="sr-only">Loading...</span>
    </Spinner>
  {:then response}
    <h2 class="mdb-page-header mdb-card-style mt-3 p-2">
      {response?.data?.title}
    </h2>
    <MediaComponent media={response.data} full />
  {:catch error}
    <NoMedia full />
  {/await}
</Container>

<style>
</style>
