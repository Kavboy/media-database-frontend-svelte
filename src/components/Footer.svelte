<script lang="ts">
  import { Container } from "sveltestrap";
  import { Link } from "svelte-routing";

  import {
    faCopyright,
    //@ts-ignore
  } from "@fortawesome/free-solid-svg-icons";
  import { FontAwesomeIcon } from "fontawesome-svelte";
</script>

<Container id="mdb-footer" fluid>
  <p class="mdb-copy-right pt-1">
    Studienprojekt <FontAwesomeIcon icon={faCopyright} /> 2022
  </p>
</Container>

<style>
  :global(#mdb-footer) {
    min-height: 30px;
    background-color: var(--primary-color);
    color: #fff;
    text-align: right;
  }

  .mdb-copy-right {
    margin: 0;
  }
</style>
