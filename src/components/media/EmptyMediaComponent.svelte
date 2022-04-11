<script lang="ts">
  const date = new Date().toLocaleDateString("DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  export let noLink: boolean = false;
  export let full: boolean = false;
</script>

<div
  class="d-flex mdb-empty-media mdb-card-style {noLink
    ? 'mdb-media-no-link'
    : ''} {full ? 'mdb-media-full' : 'mdb-media'} mb-3 mt-3"
>
  <div
    class="flex-shrink-0 mdb-media-poster mdb-no-media-poster ms-md-3 me-md-3 ms-auto me-auto mt-3 mb-lg-3"
  />
  <div class="flex-grow-1 m-3">
    <div class="d-flex justify-content-md-start justify-content-center">
      <p class={`mdb-fsk me-3`}>0</p>
      <h4>Keine Medien gefunden!</h4>
    </div>

    <p>Hinzugefügt: {date}</p>

    {#if !noLink}
      <p>Klicke hier um neue Medien hinzuzufügen!</p>
    {/if}

    <p class="mdb-no-media-text" />
    <p class="mdb-no-media-text" />
    <p class="mdb-no-media-text" />
  </div>
</div>

<style>
  .mdb-media-no-link:hover {
    cursor: initial;
    transform: initial;
  }

  .mdb-no-media-poster {
    width: 185px;
    height: 278px;
    background-color: lightgray;
  }

  .mdb-no-media-text {
    background-color: lightgray;
    height: 0.5rem;
  }
</style>
