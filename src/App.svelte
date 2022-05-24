<script lang="ts">
  import { Router, Route } from "svelte-routing";
  import Header from "./components/HeaderComponent.svelte";
  import News from "./pages/News.svelte";
  import { Styles, Container } from "sveltestrap";
  import FullMedia from "./pages/FullMedia.svelte";
  import Error from "./components/Error.svelte";
  import { authStore } from "./stores/authStore";
  import MediaManagement from "./pages/MediaManagement.svelte";
  import AddMedia from "./pages/AddMedia.svelte";
  import type { User } from "./utils/interfaces";
  import Footer from "./components/Footer.svelte";

  export let url = "";

  authStore.check();
  let user: User | null;

  authStore.subscribe((value) => (user = value));
</script>

<Styles />

<Router {url}>
  <Header />
  <Container id="mdb-route-container">
    <Error />
    <Route path="/"><News /></Route>
    <Route path="media/:id" let:params><FullMedia id={params.id} /></Route>
    {#if user}
      <Route path="media-management"><MediaManagement /></Route>
      <Route path="add-media"><AddMedia /></Route>
    {/if}
    <Route path="*"><News /></Route>
  </Container>
  <Footer />
</Router>

<style>
  :global(#mdb-route-container) {
    min-height: calc(100vh - 30px - 4.4rem);
    overflow: hidden;
  }
</style>
