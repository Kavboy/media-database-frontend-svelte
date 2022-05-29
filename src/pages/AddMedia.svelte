<script lang="ts">
  import {
    Container,
    Form,
    FormGroup,
    FormText,
    Input,
    Label,
    Spinner,
    Button,
  } from "sveltestrap";
  import {
    addMedia,
    getFSK,
    getGenre,
    getLocations,
    getMediums,
  } from "../apis/AxiosLaravel";
  import { errorStore } from "@src/stores/errorStore";
  import { authStore } from "@src/stores/authStore";
  import { genreDisplay, genresGerman, getPosterSRC } from "@src/utils/media";
  import {
    getKeyFromYoutubeLink,
    handleCheckBoxes,
    validateData,
  } from "@src/utils/addUpdateMedia";
  import { onMount } from "svelte";

  authStore.requireAuth(["Admin", "Creator"]);

  let disabled = false;
  let laravelMediums = [];
  let laravelFSK = [];
  let laravelLocations = [];
  let laravelGenre = [];

  const loadMediums = async () => {
    try {
      laravelMediums = await getMediums();
    } catch (error) {
      if (!error.response) {
        errorStore.setNetworkError();
      } else {
        errorStore.setUnexpectedError();
      }
    }
  };

  loadMediums();

  const loadGenres = async () => {
    try {
      laravelGenre = await getGenre();
    } catch (error) {
      if (!error.response) {
        errorStore.setNetworkError();
      } else {
        errorStore.setUnexpectedError();
      }
    }
  };

  loadGenres();

  const loadFSK = async () => {
    try {
      laravelFSK = await getFSK();
    } catch (error) {
      if (!error.response) {
        errorStore.setNetworkError();
      } else {
        errorStore.setUnexpectedError();
      }
    }
  };

  loadFSK();

  let fileValidation = null;

  let file = null;

  let validation = {
    type: null,
    title: null,
    release_date: null,
    overview: null,
    youtube_link: null,
    age_rating: null,
    location: null,
    mediums: null,
    genres: null,
    cast: null,
    seasons: null,
  };

  const setValidation = (valData) => {
    validation = { ...validation, ...valData };
  };

  let data = {
    type: "",
    title: "",
    release_date: "",
    overview: "",
    youtube_link: "",
    age_rating: "0",
    location: "",
    mediums: [],
    genres: [],
    cast: [],
    seasons: [],
  };

  const setData = (newData: object) => {
    data = { ...data, ...newData };
  };

  const resetValidation = () => {
    fileValidation = null;
    setValidation({
      type: null,
      title: null,
      release_date: null,
      overview: null,
      youtube_link: null,
      age_rating: null,
      location: null,
      mediums: null,
      genres: null,
      cast: null,
      seasons: null,
    });
  };

  const handleFile = (e: Event) => {
    resetValidation();
    const input = e.target as HTMLInputElement;
    file = input.files[0];
  };

  const handleCheckbox = (e: Event) => {
    resetValidation();
    handleCheckBoxes(
      (e.target as HTMLInputElement).name,
      (e.target as HTMLInputElement).value,
      data,
      setData
    );
  };

  const handleSeasons = (seasons) => {
    setData({
      ...data,
      seasons,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    disabled = true;

    const error = validateData(data);

    const temp = {};
    Object.keys(validation).forEach((key) => {
      const toTest = error?.details?.find((err) => err.path.includes(key));
      temp[key] = !toTest;
    });

    if (temp) {
      setValidation({
        ...validation,
        ...temp,
      });
    }

    if (!file) {
      fileValidation = false;
    } else {
      fileValidation = true;
    }

    if (!error && file) {
      const fd = new FormData();

      setData({
        ...data,
        youtube_link: getKeyFromYoutubeLink(data.youtube_link),
      });

      // Workaround to set the youtube link, because setData isn´t executed properly
      data.youtube_link = getKeyFromYoutubeLink(data.youtube_link);

      Object.keys(data).forEach((el) => {
        if (el === "mediums" || el === "genres" || "seasons") {
          data[el]?.forEach((arr) => {
            fd.append(el + "[]", arr);
          });
        } else if (el === "cast") {
          data[el]?.forEach((arr) => {
            fd.append(el + "[]", JSON.stringify(arr));
          });
        } else {
          fd.append(el, data[el]);
        }
      });

      fd.append("poster_file", file);

      fd.append("_method", "put");

      try {
        addMedia(fd);
      } catch (error) {
        console.log(error);
        resetValidation();
        disabled = false;
        if (!error.response) {
          errorStore.setNetworkError();
        } else {
          errorStore.setUnexpectedError();
          console.log("ManualAdd");
          console.log(error);
        }
      }
    } else {
      disabled = false;
    }
  };
</script>

<Container id="mdb-add-media">
  <h2 class="mdb-page-header mdb-card-style mt-3 p-2">Medien hinzufügen</h2>
  {#if laravelMediums.length === 0 && laravelFSK.length === 0 && laravelGenre.length === 0 && laravelLocations.length === 0}
    <Spinner id="mdb-spinner" type="border" role="status" size="xl">
      <span class="sr-only">Loading...</span>
    </Spinner>
  {:else}
    <Container class="mdb-add-media-form mdb-card-style">
      <Form
        id="mdb-create-form"
        class="p-3"
        novalidate
        on:submit={handleSubmit}
      >
        <FormGroup id="mdb-create-form.formMediaType">
          <Label>Typ der Medie</Label>
          <Input
            name="type"
            bind:value={data.type}
            type="select"
            {disabled}
            invalid={validation.type !== null ? !validation.type : null}
            valid={validation.type}
            feedback="Ein Typ muss angegeben werden"
          >
            <option />
            <option value="Movie">Film</option>
            <option value="TV">Serie</option>
          </Input>
        </FormGroup>

        <FormGroup id="mdb-create-form.formTitle">
          <Label>
            {#if data.type === "TV"}
              Serien Titel
            {:else if data.type === "Movie"}
              Film Titel
            {:else}
              Media Titel
            {/if}
          </Label>
          <Input
            name="title"
            bind:value={data.title}
            type="text"
            {disabled}
            invalid={validation.title !== null ? !validation.title : null}
            valid={validation.title}
            feedback="Ein Titel sollte angegeben werden"
          />
        </FormGroup>

        <FormGroup id="mdb-create-form.formOverview">
          <Label
            >{data?.type === "TV"
              ? "Serien Beschreibung"
              : data?.type === "Movie"
              ? "Film Beschreibung"
              : "Media Beschreibung"}</Label
          >
          <Input
            name="overview"
            bind:value={data.overview}
            as="textarea"
            rows={3}
            {disabled}
            invalid={validation.overview !== null ? !validation.overview : null}
            valid={validation.overview}
          />
        </FormGroup>

        <FormGroup id="mdb-create-form.formFsk">
          <Label
            >{data?.type === "TV"
              ? "Serien FSK"
              : data?.type === "Movie"
              ? "Film FSK"
              : "Media FSK"}</Label
          >
          <Input
            required
            name="age_rating"
            bind:value={data.age_rating}
            type="select"
            {disabled}
            invalid={validation.age_rating !== null
              ? !validation.age_rating
              : null}
            valid={validation.age_rating}
          >
            <option value="" />
            {#each laravelFSK as fsk}
              <option value={fsk}>{fsk}</option>
            {/each}
          </Input>
        </FormGroup>

        <FormGroup id="mdb-create-form.formReleaseDate">
          <Label
            >{data?.type === "TV"
              ? "Serien Erscheinungsdatum"
              : data?.type === "Movie"
              ? "Film Erscheinungsdatum"
              : "Media Erscheinungsdatum"}</Label
          >
          <Input
            required
            name="release_date"
            bind:value={data.release_date}
            type="date"
            {disabled}
            invalid={validation.release_date !== null
              ? !validation.release_date
              : null}
            valid={validation.release_date}
            feedback="Bitte ein Erscheinungsdatum eingeben"
          />
        </FormGroup>

        <FormGroup id="mdb-create-form.formReleaseDate">
          <Label
            >{data?.type === "TV"
              ? "Serien Poster"
              : data?.type === "Movie"
              ? "Film Poster"
              : "Media Poster"}</Label
          >

          <div class="d-flex">
            <Input
              type="file"
              name="poster"
              id="mdb-add-media-file"
              {disabled}
              valid={fileValidation}
              invalid={fileValidation !== null ? !fileValidation : null}
              on:change={handleFile}
            />
          </div>
        </FormGroup>

        <FormGroup id="mdb-create-form.formYoutubeLink">
          <Label>
            {data?.type === "TV"
              ? "Serien Youtube Trailer Link"
              : data?.type === "Movie"
              ? "Film Youtube Trailer Link"
              : "Media Youtube Trailer Link"}
          </Label>
          <FormText>
            <a
              class="mdb-youtube-link-label"
              href={data?.title
                ? `https://www.youtube.com/results?search_query=${data.title}`
                : "https://www.youtube.com"}
              rel="noreferrer"
              target="_blank"
            >
              Suche hier
            </a>
          </FormText>
          <Input
            name="youtube_link"
            bind:value={data.youtube_link}
            pattern="https://((www)?(\.)?)youtube(\.)com/watch(\?)v=([a-zA-Z\d&=])+"
            type="url"
            {disabled}
            invalid={validation.youtube_link !== null
              ? !validation.youtube_link
              : null}
            valid={validation.youtube_link}
            feedback="Es muss ein Youtube link in folgendem Format sein: https://www.youtube.com/watch?v=jMkaCEP-l4g"
          />
        </FormGroup>

        <FormGroup required id="mdb-create-form.formMediums" class="mb-3">
          <Label>Wähle ein Medium</Label>
          <div>
            {#each laravelMediums as medium}
              <Input
                label={medium}
                name="mediums"
                on:change={handleCheckbox}
                type="checkbox"
                value={medium}
                class="form-check-inline"
                id={`inline-checkbox-${medium.toLowerCase()}`}
                {disabled}
                invalid={validation.mediums !== null
                  ? !validation.mediums
                  : null}
                valid={validation.mediums}
                feedback="Mindestens eines muss ausgewählt werden"
              />
            {/each}
          </div>
        </FormGroup>

        <FormGroup required id="mdb-create-form.formGenres" class="mb-3">
          <Label>Wähle ein Genre</Label>
          <div class="mb-3">
            {#each laravelGenre as genre}
              <Input
                label={genresGerman[genre]}
                name="genres"
                on:change={handleCheckbox}
                type="checkbox"
                value={genre}
                class="form-check-inline"
                id={`inline-checkbox-${genre}`}
                {disabled}
                invalid={validation.genres !== null ? !validation.genres : null}
                valid={validation.genres}
                feedback="Mindestens eines muss ausgewählt werden"
              />
            {/each}
          </div>
        </FormGroup>

        <Button
          class="mdb-add-media-form-submit mt-3"
          color="primary"
          type="submit"
          {disabled}
        >
          {data?.type === "TV"
            ? "Serie hinzufügen"
            : data?.type === "Movie"
            ? "Film hinzufügen"
            : "Media hinzufügen"}
        </Button>
      </Form>
    </Container>
  {/if}
</Container>

<style>
  :global(#mdb-create-form) {
    margin-bottom: 1%;
  }
  :global(#mdb-create-form button) {
    width: 100%;
    margin-bottom: 1%;
  }
</style>
