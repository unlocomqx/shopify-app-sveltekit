import createApp from '@shopify/app-bridge';

export function initAppBridge() {
	const urlParams = new URLSearchParams(window.location.search);
	const host = urlParams.get('host');

	if (host) {
		const createAppFn = typeof createApp === 'function' ? createApp : createApp.default;
		const app = createAppFn({
			// replaced by vite-plugin-replace in svelte.config.js
			apiKey: 'ENV_SHOPIFY_API_KEY',
			host,
			forceRedirect: true
		});
	}
}
