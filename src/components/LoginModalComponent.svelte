<script lang="ts">
  import {
    Button,
    Form,
    Spinner,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    FormGroup,
    Label,
    Input,
  } from "sveltestrap";
  import Joi from "joi";
  import { authStore } from "../stores/authStore";
  import { errorStore } from "../stores/errorStore";
  import type { User } from "@src/utils/interfaces";
  import { onDestroy } from "svelte";

  export let show: boolean = false;
  export let onHide: Function = () => {};

  /**
   * Validation schema for the login data
   * @type {Joi.ObjectSchema<any>}
   */
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });

  let inner: HTMLElement;
  let disabled = false;
  let loading = false;
  let formData = { username: "", password: "" };
  let validation = {
    username: null,
    password: null,
  };

  const setDisabled = (value: boolean) => {
    disabled = value;
  };
  const setLoading = (value: boolean) => (loading = value);
  const setFormData = (value: any) => (formData = value);
  const setValidation = (value: any) => (validation = value);

  let user: User | null;

  const unsubscribeAuth = authStore.subscribe((value) => (user = value));

  const resetValidation = () => {
    setValidation({ username: null, password: null });
  };

  const resetFormData = () => {
    formData.username = "";
    formData.password = "";
  };

  const handleEnterKey = (e) => {
    if (e.charCode === 13) {
      handleLogin(e);
    }
  };

  /**
   * Method that has all necessary steps to send the login request
   * @param e event object
   */
  const handleLogin = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDisabled(true);

    const { error } = schema.validate(formData, {
      abortEarly: false,
      errors: { label: "key" },
    });

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

    if (!error) {
      setLoading(true);
      authStore
        .login(formData.username, formData.password)
        .then((res) => {
          if (res) {
            resetFormData();
            setDisabled(false);
            setLoading(false);
            onHide();
          }
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status === 401) {
              setValidation({ username: false, password: false });
              setDisabled(false);
              setLoading(false);
            } else {
              errorStore.setNetworkError();
              resetFormData();
              setDisabled(false);
              setLoading(false);
              onHide();
            }
          } else {
            errorStore.setNetworkError();
            resetFormData();
            setDisabled(false);
            setLoading(false);
            onHide();
          }
        });
    } else {
      setDisabled(false);
    }
  };

  onDestroy(unsubscribeAuth);
</script>

<Modal
  isOpen={show}
  size="lg"
  aria-labelledby="contained-modal-title-vcenter"
  backdrop="static"
  centered
  on:open={() => inner.focus()}
  on:close={() => {
    resetValidation();
    resetFormData();
  }}
>
  <ModalHeader id="contained-modal-title-vcenter">Login</ModalHeader>
  <ModalBody>
    {#if loading}
      <Spinner
        id="mdb-modal-spinner"
        class="d-block me-auto ms-auto mb-5 mt-5"
        type="border"
        role="status"
        size="xl"
      >
        <span class="sr-only">Loading...</span>
      </Spinner>
    {:else}
      <Form id="mdb-login-form" validated={false}>
        <FormGroup>
          <Label>Username</Label>
          <Input
            required
            type="text"
            name="username"
            bind:value={formData.username}
            {disabled}
            placeholder="Username"
            invalid={validation.username !== null ? !validation.username : null}
            valid={validation.username}
            bind:inner
          />
        </FormGroup>
        <FormGroup>
          <Label>Passwort</Label>
          <Input
            required
            type="password"
            name="password"
            bind:value={formData.password}
            {disabled}
            placeholder="Passwort"
            on:keypress={handleEnterKey}
            invalid={validation.password !== null ? !validation.password : null}
            valid={validation.password}
            feedback="Username oder Passwort falsch"
          />
        </FormGroup>
      </Form>
    {/if}
  </ModalBody>
  <ModalFooter>
    {#if !loading}
      <Button type="submit" color="primary" outline on:click={handleLogin}
        >Login</Button
      >
    {/if}
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
