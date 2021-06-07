import createApp from '@shopify/app-bridge';
import { Redirect } from '@shopify/app-bridge/actions/index';

export function initAppBridge() {
	const urlParams = new URLSearchParams(window.location.search);
	const shop = urlParams.get('shop');
	const host = urlParams.get('host');

	if (host) {
		const createAppFn = typeof createApp === 'function' ? createApp : createApp.default;
		const app = createAppFn({
			// replaced by vite-plugin-replace in svelte.config.js
			apiKey: 'ENV_SHOPIFY_API_KEY',
			host,
			forceRedirect: true
		});
	} else {
		const permissionUrl = `https://${shop}/admin/oauth/authorize?client_id=ENV_SHOPIFY_API_KEY&scope=read_products,read_content&redirect_uri=ENV_HOST/auth/callback`;

		// If the current window is the 'parent', change the URL by setting location.href
		if (window.top == window.self) {
			window.location.assign(permissionUrl);

			// If the current window is the 'child', change the parent's URL with Shopify App Bridge's Redirect action
		} else {
			const app = createApp({
				apiKey: 'ENV_SHOPIFY_API_KEY',
				shopOrigin: shop,
				forceRedirect: false
			});

			Redirect.create(app).dispatch(Redirect.Action.REMOTE, permissionUrl);
		}
	}
}
