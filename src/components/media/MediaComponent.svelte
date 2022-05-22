<script lang="ts">
  import type { Media } from "../../utils/interfaces";
  import { genreDisplay, getFSKClass, getPosterSRC } from "../../utils/media";
  import { Link } from "svelte-routing";
  import {} from "sveltestrap";

  export let media: Media = null;
  export let full: boolean = false;

  const fskClass = getFSKClass(media?.age_rating);
  const imgSrc = getPosterSRC(media?.tmdb_id, media.poster_path);
  let youtubeLink: string;

  if (media.youtube_link) {
    youtubeLink =
      "https://www.youtube-nocookie.com/embed/" + media.youtube_link;
  }

  // Format date based on language
  const added = new Date(media.created_at).toLocaleDateString("DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const released = new Date(media.release_date).toLocaleDateString("DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
</script>

{#if !full}
  <Link class="mdb-media-link" to={"/media/" + media.id}>
    <div class="d-flex mdb-media mdb-card-style mb-3 mt-3">
      <img
        class="flex-shrink-0 mdb-media-poster ms-md-3 me-md-3 ms-auto me-auto mt-3 mb-lg-3"
        src={imgSrc}
        alt={media.title + "Poster"}
      />
      <div class="flex-grow-1 p-3">
        <div class="d-flex flex-md-row flex-column justify-content-md-between">
          <div class="d-flex justify-content-md-start justify-content-center">
            <p class={`mdb-fsk ${fskClass} me-3`}>{media.age_rating}</p>
            <h4>{media.title}</h4>
          </div>
        </div>
        <p>Hinzugefügt: {added}</p>
        <p>{media.overview}</p>
      </div>
    </div>
  </Link>
{:else}
  <div
    class="mdb-media-full mdb-media mdb-card-style mdb-media-no-link mb-3 mt-3"
  >
    <div class="mdb-media-full-head p-3">
      <img
        class="mdb-media-poster ms-md-3 me-md-3 ms-auto me-auto mb-3"
        src={imgSrc}
        alt={media.title + "Poster"}
      />
      <div class="mdb-media-info ms-3 w-100">
        <h6 class="d-inline">Typ:</h6>
        <p class="d-inline">{media.type === "Movie" ? "Film" : "Serie"}</p>
        <p />
        <div class={`mdb-fsk mdb-full-fsk ${fskClass} me-lg-3`}>
          {media.age_rating}
        </div>
        <h6 class="d-inline">Hinzugefügt:</h6>
        <p class="d-inline">{added}</p>
        <p />
        <h6 class="d-inline">Erschienen:</h6>
        <p class="d-inline">{released}</p>
        <p />
        <h6 class="d-inline">Medium:</h6>
        <p class="d-inline">{media.mediums.join(", ")}</p>
        <p />
        <!-- <h6 class="d-inline">Standort:</h6>
        <p class="d-inline">{media.location}</p>
        <p /> -->
        <h6 class="d-inline">Genre:</h6>
        <p class="d-inline">{genreDisplay(media.genres)}</p>
        <p />
        {#if media.seasons}
          <p />
          <h6 class="d-inline">Seasons:</h6>
          <p class="d-inline">{media.seasons.join(", ")}</p>
          <p />
        {/if}
        <h6>Beschreibung:</h6>
        <p>{media.overview}</p>
      </div>
    </div>
    {#if media.youtube_link}
      <hr class="mt-0" />
      <div class="container text-center">
        <h5>Trailer:</h5>
        <div class="mdb-youtube-video-container text-center">
          <iframe
            width="560"
            height="315"
            src={youtubeLink}
            title={media.title + " video player"}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    {/if}
  </div>
{/if}

<style>
  .mdb-media-no-link:hover {
    cursor: initial;
    transform: initial;
  }

  .mdb-media-full {
    padding-bottom: 2em;
    min-height: calc(100vh - 70px - 6.4rem);
  }

  .mdb-media-full h5,
  .mdb-media-full h6 {
    color: var(--primary-color);
  }

  .mdb-media-full-head {
    display: flex;
  }

  .mdb-full-fsk {
    width: 50px;
    height: 50px;
    font-size: 1.6rem;
    line-height: 47px;
    float: right;
  }

  @media (max-width: 768px) {
    .mdb-media {
      flex-flow: column;
    }

    .mdb-media-full-head {
      flex-flow: column;
    }

    .mdb-see-counter {
      margin-bottom: 1.5rem;
    }

    .mdb-media-info {
      position: relative;
    }

    .mdb-full-fsk {
      position: absolute;
      top: 0;
      right: 1rem;
    }

    .mdb-media-cast {
      grid-template-columns: 100%;
    }

    .media-body {
      margin-left: 1.5rem;
    }

    .mdb-youtube-video-container {
      overflow: hidden;
      padding-bottom: 56.25%;
      padding-top: 30px;
      position: relative;
      height: 0;
    }

    .mdb-youtube-video-container iframe,
    .mdb-youtube-video-container object,
    .mdb-youtube-video-container embed {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
</style>
