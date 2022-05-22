<script lang="ts">
  import { Container, Spinner, Table, Button } from "sveltestrap";
  import { FontAwesomeIcon } from "fontawesome-svelte";
  import { getMedia, getMediasTable } from "../apis/AxiosLaravel";
  import { onDestroy } from "svelte";
  import { errorStore } from "@src/stores/errorStore";
  import { authStore } from "../stores/authStore";
  import { genreDisplay, getFSKClass, getPosterSRC } from "@src/utils/media";
  import { Link } from "svelte-routing";
  import { faEye, faPlusSquare } from "@fortawesome/free-solid-svg-icons";

  authStore.requireAuth(["Admin", "Creator"]);

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  let page = urlParams.get("page") ? urlParams.get("page") : 1;

  const promise = getMediasTable(page);

  promise.catch((error) => {
    if (!error.response) {
      errorStore.setNetworkError();
    } else {
      errorStore.setUnexpectedError();
    }
  });
</script>

<Container id="mdb-media-table">
  <h2 class="mdb-page-header mdb-card-style mt-3 p-2">Medienverwaltung</h2>
  <Container class="mdb-media-table mdb-card-style mb-3">
    {#await promise}
      <Spinner id="mdb-spinner" type="border" role="status" size="xl">
        <span class="sr-only">Loading...</span>
      </Spinner>
    {:then medias}
      <Table striped responsive>
        <thead class="text-center">
          <tr>
            <th>Id</th>
            <th>Poster</th>
            <th>Typ</th>
            <th>FSK</th>
            <th>Titel</th>
            <th>Beschreibung</th>
            <th>Medium</th>
            <th>Seasons</th>
            <th>Poster</th>
            <th>Ansehen</th>
          </tr>
        </thead>
        <tbody>
          {#each medias.data as el, index}
            <tr>
              <td>{el.id}</td>
              <td
                ><img
                  class="mdb-table-poster"
                  src={getPosterSRC(el.tmdb_id, el.poster_path, "w92")}
                  alt={el.title + " poster"}
                />
              </td>
              <td>{el.type}</td>
              <td>
                <div class={`mdb-fsk ${getFSKClass(el.age_rating)}`}>
                  {el.age_rating}
                </div>
              </td>
              <td class="mdb-table-title">{el.title}</td>
              <td>
                <div>{el.overview}</div>
              </td>
              <td>{genreDisplay(el.genres)}</td>
              <td>{el.mediums.join(", ")}</td>
              <td>{el.seasons?.join(", ")}</td>
              <td class="mdb-table-display"
                ><Link to={`/media/${el.id}`}
                  ><FontAwesomeIcon icon={faEye} /></Link
                ></td
              >
            </tr>
          {/each}
          <tr>
            <td colSpan="12" aria-controls="button" class="mdb-table-add-new">
              <Link to="/add-media">
                <FontAwesomeIcon class="mr-2" icon={faPlusSquare} /> Neue Medien
                hinzufügen
              </Link>
            </td>
          </tr>
        </tbody>
      </Table>
    {/await}
  </Container>
</Container>

<style>
  .mdb-table-title {
    min-width: 180px;
  }

  .mdb-media-table {
    min-height: calc(100vh - 300px);
  }

  .mdb-table-poster {
    max-width: 92px;
    height: auto;
  }

  .mdb-table-display,
  .mdb-table-edit,
  .mdb-table-delete {
    vertical-align: middle !important;
    text-align: center;
  }

  .mdb-table-display:hover {
    color: var(--secondary-color);
    cursor: pointer;
  }

  .mdb-table-edit:hover {
    color: var(--secondary-color);
    cursor: pointer;
  }

  .mdb-table-delete:hover {
    color: var(--danger);
    cursor: pointer;
  }

  .mdb-table-add-new {
    background-color: var(--primary-color);
    text-align: center;
  }

  :global(.mdb-table-add-new a) {
    color: #fff;
    font-size: 1.5rem;
    padding: 0.2rem !important;
    text-decoration: none;
  }

  :global(.mdb-table-add-new a:hover) {
    color: #fff;
  }

  .mdb-table-add-new:hover {
    background-color: var(--secondary-color);
    cursor: pointer;
  }

  .mdb-table-last-admin {
    width: 20%;
  }
</style>
