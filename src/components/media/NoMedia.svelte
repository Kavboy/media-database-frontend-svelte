<script lang="ts">
  import { Link } from "svelte-routing";
  import EmptyMedia from "./EmptyMediaComponent.svelte";
  const auth = {
    user: {
      role: "Admin",
    },
  };

  export let noLink: boolean = false;
  export let full: boolean = false;
</script>

{#if auth?.user && (auth?.user?.role === "Admin" || auth?.user?.role === "Creator")}
  <Link class="mdb-media-link" to={"/add-media"}>
    <EmptyMedia />
  </Link>
{:else if !auth?.user}
  <EmptyMedia noLink />
{/if}

<style>
</style>
