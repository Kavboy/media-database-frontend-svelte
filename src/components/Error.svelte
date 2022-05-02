<script lang="ts">
  import type { AlertError } from "../utils/interfaces";
  import { errorStore } from "../stores/errorStore";
  import { Alert } from "sveltestrap";
  import { onDestroy } from "svelte";

  const errors = {
    "network-error":
      "Ein Netzwerkproblem ist aufgetreten, bitte versuche es später erneut.",
    "401-error": "Authentifizierung fehlgeschlagen, bitter erneut versuchen.",
    "unexpected-error":
      "Etwas unerwartetes ist aufgetreten, bitter versuche es später erneut.",
    "tmdb-401-error":
      "TMDB meldete nicht authorisiert, vielleicht ist der API-Key falsch oder nicht gültig.",
    "tmdb-404-error":
      "TMDB meldete, dass die Angefragte Resource nicht gefunden wurde.",
  };

  let error: AlertError;

  const unsubscribe = errorStore.subscribe((value) => (error = value));

  onDestroy(unsubscribe);
</script>

<Alert
  color={error.variant}
  isOpen={error.show}
  dismissible
  toggle={() => errorStore.hideError()}
>
  {errors[error.content]}
</Alert>

<style>
</style>
