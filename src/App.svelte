<script lang="ts">
  import { Router, Route } from "svelte-routing";
  import Header from "./components/HeaderComponent.svelte";
  import News from "./pages/News.svelte";
  import { Styles, Container } from "sveltestrap";
  import FullMedia from "./pages/FullMedia.svelte";

  export let url = "";
</script>

<Styles />

<Router {url}>
  <Header />
  <Container id="mdb-route-container">
    <Route path="/"><News /></Route>
    <Route path="media/:id" let:params><FullMedia id={params.id} /></Route>
  </Container>
</Router>

<style>
  :global(#mdb-route-container) {
    min-height: calc(100vh - 70px - 4.4rem);
    overflow: hidden;
  }
</style>
