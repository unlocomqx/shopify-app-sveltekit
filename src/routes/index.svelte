<script>
	import { initAppBridge } from "../shopify/bridge.js";

  if (typeof window !== "undefined") {
    try {
      initAppBridge();
    } catch (e) {
      console.error(e);
    }
  }
</script>

<h1>Welcome to SvelteKit 1</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

