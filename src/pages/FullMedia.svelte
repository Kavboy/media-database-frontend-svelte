<script lang="ts">
  import MediaComponent from "../components/media/MediaComponent.svelte";
  import NoMedia from "../components/media/NoMedia.svelte";
  import { Container, Spinner } from "sveltestrap";
  import { getMedia } from "../apis/AxiosLaravel";
  import { onDestroy } from "svelte";
  import Error from "../components/Error.svelte";
  import { errorStore } from "@src/stores/errorStore";

  export let id: string;

  const promise = getMedia(id);

  promise.catch((error) => {
    if (!error.response) {
      errorStore.setNetworkError();
    } else {
      errorStore.setUnexpectedError();
    }
  });
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
