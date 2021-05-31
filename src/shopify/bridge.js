import createApp from '@shopify/app-bridge';

export function initAppBridge() {
	const urlParams = new URLSearchParams(window.location.search);
	const host = urlParams.get('host');

	// replaced by vite-plugin-replace in svelte.config.js
	const apiKey = 'ENV_SHOPIFY_API_KEY';

	const createAppFn = typeof createApp === 'function' ? createApp : createApp.default;
	const app = createAppFn({
		apiKey,
		host,
		forceRedirect: true
	});
}
