<script lang="ts">
  import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Button,
  } from "sveltestrap";
  import { Link } from "svelte-routing";

  import {
    faKey,
    faUser,
    faSignOutAlt,
    //@ts-ignore
  } from "@fortawesome/free-solid-svg-icons";
  import { FontAwesomeIcon } from "fontawesome-svelte";
  import LoginModalComponent from "./LoginModalComponent.svelte";
  import type { User } from "../utils/interfaces";
  import { authStore } from "../stores/authStore";
  import { onDestroy } from "svelte";

  let user: User | null;

  const unsubscribe = authStore.subscribe((value) => {
    user = value;
  });

  let isOpen = false;
  let loginShow = false;

  function handleUpdate(event) {
    isOpen = event.detail.isOpen;
  }

  const setLoginShow = (value) => {
    loginShow = value;
  };

  onDestroy(unsubscribe);
</script>

<Navbar id="mdb-header" color="dark" dark expand="md">
  <NavbarBrand id="mdb-home" class="mdb-test" href="/">MDb</NavbarBrand>
  <NavbarToggler on:click={() => (isOpen = !isOpen)} />
  <Collapse
    id="mdb-header-nav-collapse"
    {isOpen}
    navbar
    expand="md"
    on:update={handleUpdate}
  >
    <Nav navbar class="me-md-auto">
      <NavItem>
        <Link class="nav-link" to="/">News</Link>
      </NavItem>
    </Nav>
    <Nav navbar id="mdb-login" class="justify-content-end">
      {#if !user}
        <NavItem>
          <NavLink
            id="mdb-nav-button"
            on:click={(e) => {
              e.preventDefault();
              setLoginShow(true);
            }}
          >
            <FontAwesomeIcon icon={faKey} />
          </NavLink>
        </NavItem>
      {:else}
        <Dropdown>
          <DropdownToggle
            class="nav-link no-button"
            aria-label="Toggle Dropdown"
            caret><FontAwesomeIcon icon={faUser} /></DropdownToggle
          >
          <DropdownMenu>
            {#if user?.role === "Creator" || user?.role === "Admin"}
              <NavItem>
                <DropdownItem>Media Management</DropdownItem>
              </NavItem>
            {/if}
            <NavItem>
              <Button
                id="mdb-nav-button"
                aria-label="Logout"
                on:click={() => authStore.logout()}
                ><FontAwesomeIcon icon={faSignOutAlt} /></Button
              >
            </NavItem>
          </DropdownMenu>
        </Dropdown>
      {/if}
    </Nav>
  </Collapse>
</Navbar>
<LoginModalComponent show={loginShow} onHide={() => setLoginShow(false)} />

<style>
  :global(.no-button) {
    border: none !important;
    font-size: 1.5rem !important;
  }

  :global(#mdb-header) {
    background-color: var(--primary-color) !important;
    color: #fff !important;
    height: 70px;
  }

  :global(#mdb-home) {
    margin-left: 1rem;
    font-size: 2.5rem;
    color: #fff !important;
    text-decoration: none;
  }

  :global(#mdb-header-nav-collapse) {
    z-index: 20;
  }

  :global(.navbar-dark .navbar-nav .nav-link) {
    color: #fff !important;
  }

  :global(.nav-link) {
    background-color: var(--primary-color) !important;
    color: #fff !important;
    font-size: 1.5rem;
    text-align: center;
    min-width: 100px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  }

  :global(.navbar-dark
      .navbar-nav
      .nav-link:hover, .dropdown-item:hover, #mdb-nav-button:hover, .dropdown-toggler:hover) {
    background-color: var(--secondary-color) !important;
    color: #fff !important;
    text-decoration: none;
  }

  :global(.navbar-dark .navbar-nav .nav-link:focus, .navbar-dark
      .navbar-nav
      .nav-link:focus) {
    background-color: var(--secondary-color) !important;
    color: #fff !important;
  }

  :global(.dropdown-menu) {
    z-index: 20;
    background-color: var(--primary-color) !important;
    padding: 0;
    border-radius: unset;
    border: none;
  }

  :global(.dropdown-item) {
    color: #fff !important;
    text-align: center;
    font-size: 1.5rem;
    line-height: 2.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.15) !important;
  }

  :global(.dropdown-item:active, .dropdown-item.active) {
    background-color: var(--secondary-color) !important;
    color: #fff !important;
  }

  :global(.dropdown-divider) {
    border-color: #fff !important;
  }

  :global(#mdb-nav-button) {
    margin: 0 auto;
    width: 100%;
    border-radius: unset;
    background-color: var(--primary-color) !important;
    border: none;
    font-size: 1.5rem;
    box-shadow: unset;
  }

  @media (min-width: 992px) {
    :global(.nav-link) {
      border-bottom: none;
    }
  }
</style>
