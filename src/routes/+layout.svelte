<script>
  import { base } from "$app/paths";
let { children } = $props();
</script>

<svelte:head>
  <link rel="stylesheet" href={`${base}/style.css`} />
<link rel="stylesheet" href={`${base}/highlight-theme.css`} />
  
</svelte:head>

<header>
  <nav>
    <a href={`${base}/`}>Home</a>
    <a href="https://github.com/nshiab/simple-data-analysis" target="_blank">About</a>
  </nav>
  <h1>My new project</h1>
  <p>The content below is just an example.</p>
</header>

<main>
  {@render children()}
</main>

<footer>
  <p>
    This page has been created with <a
      href="https://github.com/nshiab/setup-sda">setup-sda</a
    >.
  </p>
</footer>
