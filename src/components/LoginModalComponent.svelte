<script lang="ts">
  import {
    Button,
    Form,
    Spinner,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
  } from "sveltestrap";

  export let show: boolean = false;
  export let onHide: Function = () => {};

  let user = {
    role: "Admin",
  };
  let auth = false;
</script>

<Modal
  isOpen={show}
  size="lg"
  aria-labelledby="contained-modal-title-vcenter"
  backdrop="static"
  centered
  on:close={() => {}}
>
  <ModalHeader id="contained-modal-title-vcenter">Login</ModalHeader>
  <ModalBody />
  <ModalFooter>
    <Button
      outline
      color="danger"
      on:click={() => {
        onHide();
      }}>Abbrechen</Button
    >
  </ModalFooter>
</Modal>

<style>
  :global(.modal-header) {
    background-color: var(--primary-color);
    color: #fff;
  }

  :global(.delete-modal-text) {
    font-size: 1.5rem;
  }

  :global(#mdb-modal-spinner) {
    top: calc(100vh / 2);
    left: calc(100vw / 2 - 2rem);
    width: 4rem;
    height: 4rem;
    border-width: 0.35em;
  }
</style>
