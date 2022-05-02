<script lang="ts">
  import { authStore } from "../../stores/authStore";
  import { Link } from "svelte-routing";
  import EmptyMedia from "./EmptyMediaComponent.svelte";
  import type { User } from "../../utils/interfaces";
  import { onDestroy } from "svelte";
  let user: User | null;

  const unsubscribe = authStore.subscribe((value) => {
    user = value;
  });

  export let noLink: boolean = false;
  export let full: boolean = false;

  onDestroy(unsubscribe);
</script>

{#if user && (user?.role === "Admin" || user?.role === "Creator")}
  <Link class="mdb-media-link" to={"/add-media"}>
    <EmptyMedia />
  </Link>
{:else if !user}
  <EmptyMedia noLink />
{/if}

<style>
</style>
